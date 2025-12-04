FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable

COPY package*.json ./

RUN pnpm install --prod

RUN chown -R node:node /app

COPY --from=builder --chown=node:node /app/.output .output
USER node

ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]