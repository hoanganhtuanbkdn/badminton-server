FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

CMD [ "npm", "run", "start" ]
