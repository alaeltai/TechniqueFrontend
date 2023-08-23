# This Dockerfile is intended to be used with a build pipline
# where the application is build externaly
FROM bitnami/nginx:1.23

ARG DIST_FOLDER=./dist
ARG NGINX_CONFIG=./Container/app.nginx.conf

WORKDIR /app

COPY ${DIST_FOLDER} ./
COPY ${NGINX_CONFIG} /opt/bitnami/nginx/conf/server_blocks/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]