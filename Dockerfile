FROM node:20

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN npm install

CMD ["npm","run","server"]
