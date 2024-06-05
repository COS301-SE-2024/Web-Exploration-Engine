FROM node:22-alpine

# COPY package.json /zeyatime/
# instead of just package.json, copy everything since we need it all
COPY . .
#COPY src /zeyatime/
#COPY static /zeyatime/

#switch to directory
WORKDIR .

RUN npm install

# Build the Svelte app
RUN npm run build

CMD ["npm","run","dev"]
