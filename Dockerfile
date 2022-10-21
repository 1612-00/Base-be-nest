FROM node:16-slim

WORKDIR /var/www/app

# OS TOOLS
RUN apt-get update

COPY . .

RUN apt install -y git

RUN npm ci --quiet --legacy-peer-deps

EXPOSE 3125

CMD [ "npm", "run", "start:prod" ]
