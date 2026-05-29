# Bun + Hono API server.
# Build context: the repository ROOT (the server depends on the @makespritecode/shared
# workspace and the root bun.lock), e.g.:
#   docker build -f server/Dockerfile -t makespritecode-api .
FROM oven/bun:1.3.8-alpine
WORKDIR /app

# Install workspace dependencies from the committed lockfile. All workspace
# package.json files must be present for the workspace graph to resolve.
COPY package.json bun.lock ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json
RUN bun install --frozen-lockfile --production

# Application code (raw TS — Bun runs it directly; no build step).
COPY shared ./shared
COPY server/src ./server/src
COPY server/tsconfig.json ./server/tsconfig.json

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000
EXPOSE 8000
WORKDIR /app/server
CMD ["bun", "src/index.ts"]
