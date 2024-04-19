FROM node:14.17.3 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

EXPOSE 8081
# #Segunda Etapa
# FROM nginx:1.17.1-alpine

# COPY --from=build-step /app/dist/sakai /usr/share/nginx/html/cwweb