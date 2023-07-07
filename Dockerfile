FROM node:20.2.0 as clientManager

# Instalar las dependencias requeridas
RUN apt-get update \
    && apt-get install -y libnss3-dev libatk-bridge2.0-0 libgtk-3-0 libgbm-dev libasound2

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
