FROM node:14.15.1-alpine AS build-stage
RUN npm i npm@latest -g
WORKDIR /opt/app/web
COPY ./web/package.json ./web/package-lock.json ./
RUN npm install --no-optional
COPY ./web/. .
RUN npm run build

FROM node:14.15.1-alpine AS production-stage
RUN npm i npm@latest -g
WORKDIR /opt/app
COPY --from=build-stage /opt/app/web/dist ./public
COPY ./api/package.json ./api/package-lock.json ./
RUN npm ci --only=production
COPY ./api/. .

ENV NODE_ENV production
ENV PORT 80

EXPOSE 80 19132
VOLUME /data

CMD ["node", "./init.js"]