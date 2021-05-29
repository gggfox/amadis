FROM node:14

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn 

# Bundle app source
COPY . .
COPY .env.production .env
RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD ["node", "dist/index.js"]

# Run as non-root user
USER node