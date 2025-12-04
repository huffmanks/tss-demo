FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package*.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable

COPY package*.json ./

RUN pnpm install --prod

RUN addgroup -g 1000 nodejs && adduser -u 1000 -G nodejs -S nodejs
RUN chown -R nodejs:nodejs /app

COPY --from=builder --chown=nodejs:nodejs /app/.output .output
USER nodejs

ENV PORT 3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]