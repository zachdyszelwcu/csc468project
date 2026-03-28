FROM node:18-alpine

WORKDIR /apps

COPY package.json .

RUN npm install

COPY yolo.js /apps
COPY files/   /apps/files
copy server.js /apps

EXPOSE 3000

CMD ["node", "server.js"]