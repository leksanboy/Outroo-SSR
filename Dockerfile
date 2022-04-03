FROM node:slim

WORKDIR /home/node/app
COPY dist /home/node/app/dist

EXPOSE 4000
CMD [ "node", "dist/server.js" ]
