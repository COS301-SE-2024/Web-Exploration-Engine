FROM node:18

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install -y gnupg wget ca-certificates fonts-liberation \
    && wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mkdir -p /app/webscraper /app/.nx/cache /app/dist

COPY ../.editorconfig ./
COPY ../.eslintignore ./
COPY ../.eslintrc.json ./
COPY ../jest.config.ts ./
COPY ../jest.preset.js ./
COPY ../nx.json ./
COPY ../package*.json ./
COPY ../tsconfig.base.json ./
COPY ../webscraper ./webscraper
COPY ../webscraper/.eslintrc.json ./webscraper/.eslintrc.json

RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm install

RUN addgroup --system webscraper && adduser --system --ingroup webscraper webscraper

# Create the home directory for the webscraper user and set ownership
RUN mkdir -p /home/webscraper && chown -R webscraper:webscraper /home/webscraper

RUN chown -R webscraper:webscraper /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV HOME=/home/webscraper

EXPOSE 3003

USER webscraper

CMD ["npx", "nx", "serve", "webscraper", "--skip-nx-cache", "--configuration=production", "--verbose"]