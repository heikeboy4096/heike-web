FROM node:10.14.2

WORKDIR /var/app

COPY ./src/* /var/app/

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]


