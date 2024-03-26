FROM node:20

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN npm install

COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

CMD ["./wait-for-it.sh" , "db:5432" , "--strict" , "--timeout=300" , "--" , "npm run server"]

