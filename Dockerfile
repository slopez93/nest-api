FROM node:12

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 5000

CMD ["node", "./node_modules/serverless/bin/serverless.js", "offline", "start",  "--host", "0.0.0.0", "--httpPort", "5000", "--stage", "prod"]
