FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install
COPY . .

RUN ls *

EXPOSE 3000
CMD ["npm", "run", "dev"]