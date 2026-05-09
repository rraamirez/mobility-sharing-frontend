FROM mirror.gcr.io/library/node:20-alpine AS build
WORKDIR /app

ARG EXPO_PUBLIC_API_URL=http://localhost:8080
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run export:web

FROM mirror.gcr.io/library/nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
