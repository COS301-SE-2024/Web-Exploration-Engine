FROM node:lts-alpine

WORKDIR /app
RUN mkdir -p /app/webscraper

COPY ../.editorconfig ./
COPY ../.eslintignore ./
COPY ../.eslintrc.json ./
COPY ../jest.config.ts ./
COPY ../jest.preset.js ./
COPY ../nx.json ./
COPY ../package*.json ./
COPY ../tsconfig.base.json ./

RUN npm install -g npm@latest
RUN npm install

COPY ../webscraper ./webscraper
COPY ../webscraper/.eslintrc.json ./webscraper/.eslintrc.json

EXPOSE 3000

CMD ["npx", "nx", "serve", "webscraper", "--skip-nx-cache", "--configuration=production", "--verbose"]