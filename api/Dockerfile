FROM node:14.15.1-alpine

RUN npm --version
RUN npm i npm@latest -g
RUN npm --version

WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm install --no-optional
RUN cp ./package-lock.json ..

ENV NODE_ENV development
ENV PATH /opt/app/node_modules/.bin:$PATH

VOLUME /data

CMD ["nodemon", "--inspect=0.0.0.0:9229", "--legacy-watch", "./init.js"]