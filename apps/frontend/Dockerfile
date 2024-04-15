# pull base image
FROM node:lts-alpine3.18

WORKDIR /front/go4success

# install packages
COPY ./go4success/package.json ./
RUN npm install

COPY ./go4success .

ARG DB_API_URL

ENV EXPO_PUBLIC_API_URL=$DB_API_URL

RUN npx expo export --platform web
CMD [ "npx", "serve", "dist", "--single" ]