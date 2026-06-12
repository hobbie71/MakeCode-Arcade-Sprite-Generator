# Multi-stage build for the React client: bundle with Bun, then serve the static
# output with a minimal all-Bun server (ADR-0003, ADR-0005).
# Build context: the repository ROOT (the client depends on @makespritecode/shared).
#   docker build -f client/Dockerfile --build-arg VITE_API_URL=https://api.example.com -t makespritecode-client .
FROM oven/bun:1.3.8-alpine AS build
WORKDIR /app

# Install the full workspace (devDeps included — the build needs Tailwind + tsc).
COPY package.json bun.lock ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json
RUN bun install --frozen-lockfile

COPY shared ./shared
COPY client ./client

# Build-time public env, inlined into the bundle by `bun build --env='VITE_*'`.
ARG VITE_API_URL
ARG VITE_GOOGLE_AD_CLIENT_ID
ARG VITE_SQUARE_AD_SLOT_ID
ENV VITE_API_URL=$VITE_API_URL \
    VITE_GOOGLE_AD_CLIENT_ID=$VITE_GOOGLE_AD_CLIENT_ID \
    VITE_SQUARE_AD_SLOT_ID=$VITE_SQUARE_AD_SLOT_ID

WORKDIR /app/client
RUN bun run build

# Runtime: just the static output + the tiny Bun server (no node_modules needed).
FROM oven/bun:1.3.8-alpine AS runtime
WORKDIR /app
COPY --from=build /app/client/dist ./dist
COPY client/serve.ts ./serve.ts
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
# Run as the non-root user provided by the base image.
USER bun
CMD ["bun", "serve.ts"]
