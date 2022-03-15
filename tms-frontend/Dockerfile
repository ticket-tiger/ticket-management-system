#Docker file for React Client

#Build React client
From node: 17-alpine3.12

#Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

# Installing dependencies
RUN npm install --silent

# copy local folder to the app folder
COPY ..	

EXPOSE 3000

CMD ["npm", "start"]

 
