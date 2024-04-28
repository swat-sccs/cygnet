# Bookworm is more cross-arch-compatible and contains more
# helpful resources. Plus, we aren't space constrained.
FROM node:lts-bookworm
ENV NODE_ENV=production
WORKDIR /usr/src/app
# Leave ports for compose
# EXPOSE 3000
COPY . .
RUN rm -rf node_modules
RUN chown -R node:node /usr/src/app
USER node
RUN npm install
RUN npx prisma generate
RUN npm run build
