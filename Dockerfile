FROM alpine as node
WORKDIR /app
RUN apk add --no-cache nodejs

FROM node as pnpm
RUN apk add --no-cache curl
RUN curl -f https://get.pnpm.io/v5.js | node - add --global pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production

FROM node
COPY --from=pnpm /app/node_modules ./node_modules
COPY index.js ./
CMD node .
