FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g ts-node typescript

EXPOSE 3000

CMD ["ts-node", "src/server.ts"]