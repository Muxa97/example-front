# этап сборки (build stage)
FROM node:lts-alpine as build-stage
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# этап production (production-stage)
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /opt/app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/conf.d/app.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
