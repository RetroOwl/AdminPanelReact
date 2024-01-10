FROM node:13.12.0-alpine

WORKDIR /admin-panel-react

ENV PATH /admin-panel-react/node_modules/.bin:$PATH


COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]