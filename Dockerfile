FROM node:22-bullseye AS build

WORKDIR /app

# Copy root configs needed for build
COPY package*.json ./
COPY tsconfig.base.json ./
COPY client/package*.json ./client/

# Install Node dependencies
RUN npm ci

# Copy client source and configs
COPY client ./client

# Build client
RUN npm run build:client

# ---- Python stage ----
FROM python:3.11-slim

WORKDIR /app

# Copy server code and requirements
COPY server/requirements.txt ./server/requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt

# Copy built client and server code
COPY server ./server
COPY --from=build /app/client/dist ./server/app/static

# Set environment variables (override in Railway dashboard)
ENV HOST=0.0.0.0
ENV PORT=8000

WORKDIR /app/server

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]