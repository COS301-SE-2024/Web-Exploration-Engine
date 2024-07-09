FROM node:lts-alpine

WORKDIR /app
RUN mkdir -p /app/frontend

COPY ../.editorconfig ./
COPY ../.eslintignore ./
COPY ../.eslintrc.json ./
COPY ../jest.config.ts ./
COPY ../jest.preset.js ./
COPY ../nx.json ./
COPY ../package*.json ./
COPY ../tsconfig.base.json ./

RUN ls -la 
RUN npm install -g npm@latest
RUN npm install

COPY ../frontend ./frontend
COPY ../frontend/.eslintrc.json ./frontend/.eslintrc.json
WORKDIR /app/frontend

RUN npx nx build frontend
EXPOSE 3001

CMD ["npx", "nx", "start", "frontend", "--port", "3001", "--verbose"]