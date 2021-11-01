# STAGE 1: Build
FROM node as builder

WORKDIR /tmp

ADD . .

RUN npm ci

RUN npm run build:ssr
