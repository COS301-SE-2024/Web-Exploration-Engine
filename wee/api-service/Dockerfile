# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app
RUN mkdir -p /app/api-service /app/.nx/cache /app/dist

# Copy wee root files
COPY ../.editorconfig ./
COPY ../.eslintignore ./
COPY ../.eslintrc.json ./
COPY ../jest.config.ts ./
COPY ../jest.preset.js ./
COPY ../nx.json ./
COPY ../package*.json ./
COPY ../tsconfig.base.json ./
COPY ../api-service ./api-service
COPY ../api-service/.eslintrc.json ./api-service/.eslintrc.json


# Install dependencies
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm install

# Expose the port that the API service listens on
EXPOSE 3002

# Define the command to run the application
CMD ["npx", "nx", "serve", "api-service", "--skip-nx-cache", "--configuration=production", "--verbose"]