FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --no-audit

COPY . .

# Add your build or start commands below this line

EXPOSE 3000

CMD ["node", "server.ts"]
