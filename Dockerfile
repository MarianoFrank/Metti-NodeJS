FROM node:20

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN npm install

EXPOSE 80
EXPOSE 2525

CMD ["npm run server"]

