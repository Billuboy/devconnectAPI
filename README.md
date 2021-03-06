# API for DevConnect
_Fully Functional Express API for DevConnect with input validation and JWT Authentication._

## TechStack Used
<a href="https://nodejs.org" target="_blank"> <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" alt="node" width="40" height="40"/></a> <a href="https://mongodb.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" alt="node" width="40" height="40"/></a> 

## Platform Requriements

1. Latest version of Nodejs LTS
2. Postman(Desktop App) or ThunderClient(VS Code Extension) - For testing API

## NPM Packages Used
1. **ExpressJS** - Nodejs Framework for creating HTTP request listener
2. **Nodemon** - For restarting server everytime a file changes
3. **MongoDB** - Database for storing data
4. **PassportJS** - Nodejs Framework for implementing authentication 
5. **Joi** - For data validation

## Quick start

1. Clone this repository
2. `npm install` or `yarn install` in the project root folder on local.
3. Put your MongoDB URI and JWT secret inside of `/config/keys_dev.js`.
4. `npm run server` or `yarn server` to start the API on localhost at port 3001.
5. Test endpoints with Postman or ThunderClient.

## Routes

#### User Routes
  _These routes handle all the functionalities related to authentication._

#### Profile Routes
  _These routes handle all the functionalities related to profile._

#### Post Routes
  _Thess routes handle all the functionailties related to post._
