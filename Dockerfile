FROM node:20

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package*.json .

RUN npm install

EXPOSE 3000
EXPOSE 2525

CMD ["ls"]