# syntax=docker/dockerfile:1

FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

ENV NODE_ENV=production
RUN bun run build

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

RUN useradd --create-home --uid 1001 appuser \
	&& chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["node", "build/index.js"]
