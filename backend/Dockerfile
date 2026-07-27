FROM node:22-slim

RUN apt-get update -y \
  && apt-get install -y openssl --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate

EXPOSE 4000

CMD ["pnpm", "exec", "nodemon", "--legacy-watch", "./src/index.ts"]
