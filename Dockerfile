FROM node:16-alpine3.16

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 8000
# EXPOSE 443
CMD npm start
