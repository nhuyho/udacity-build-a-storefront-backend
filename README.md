# udacity-build-a-storefront-backend
Build a JavaScript API based on a requirements given by the stakeholders. You will architect the database, tables, and columns to fulfill the requirements.

The database schema and and API route information can be found in the (REQUIREMENT.md)

## Installation Instructions:
This section contains all the packages used in this project and how to install them. However, you can fork this repo and run the following command at the root directory to install all packages.

`yarn` or `npm install`

### Packages

#### express
`npm i -S express`
`npm i -D @types/express`

#### typescript
`npm i -D typescript`

#### db-migrate
`npm install -g db-migrate`

#### g
`npm install -g n`

#### rimraf 
`npm install --save rimraf`

#### cors
`npm install --save cors`

#### bcrypt
`npm -i bcrypt`
`npm -i -D @types/bcrypt`

#### morgan 
`npm install --save morgan`
`npm -i -D @types/morgan`

### nodemon 
`npm i nodemon`

#### jsonwebtoken
`npm install jsonwebtoken --sav`
`npm -i -D @types/jsonwebtoken`

#### jasmine
`npm install jasmine @types/jasmine @ert78gb/jasmine-ts ts-node --save-dev`

#### supertest
`npm i supertest`
`npm i --save-dev @types/supertest`


## Set up Database

`docker-compose up`  to start the docker container
`npm install` to install all dependencies
`db-migrate up` to set up the database and get access via http://127.0.0.1:5432
`npm run build` to build the app


### Start 
`npm run start` to start the app and get access via http://127.0.0.1:
### Create Databases
We shall create the dev and test database.

- connect to the default postgres database as the server's root user `psql -U postgres`

### Migrate Database
Navigate to the root directory and run the command below to migrate the database 

`yarn dev-up`

## Environmental Variables Set up
Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development, but you can change it to what works for you. 

**NB:** The given values are used in development and testing but not in production. 
```
PORT=127.0.0.1
POSTGRES_HOST="localhost"
POSTGRES_USER="###"
POSTGRES_PASSWORD="###"
POSTGRES_DB="storefront"
POSTGRES_TEST_DB="storefront"
TOKEN_KEY=###
ENV=test
BCRYPT_PASSWORD=###
SALT_ROUNDS="10"

```

## Start App
`yarn watch` or `npm run start`

### Running Ports 
After start up, the server will start on port `3000` and the database on port `5432`

## Endpoint Access
All endpoints are described in the [REQUIREMENT.md](REQUIREMENTS.md) file. 

## Token and Authentication
Tokens are passed along with the http header as 
```
Authorization   Bearer <token>
```

## Testing
Run test with 

`npm run test`

It sets the environment to `test`, migrates up tables for the test database, run the test then migrate down all the tables for the test database. 



