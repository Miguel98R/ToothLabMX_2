FROM node:18-alpine
WORKDIR /ToothLabMX_2
COPY . .
RUN npm install
CMD ["node", "./index.js"]
EXPOSE 3005