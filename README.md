# udacity-build-a-storefront-backend
Build a JavaScript API based on a requirements given by the stakeholders. You will architect the database, tables, and columns to fulfill the requirements.

The database schema and and API route information can be found in the REQUIREMENT.md

Installation Instructions:

This section contains all the packages used in this project and how to install them. However, you can fork this repo and run the following command at the root directory to install all packages.

yarn or npm install

Packages
Here are some of the few packages that were installed.

express
npm i -S express npm i -D @types/express

typescript
npm i -D typescript

db-migrate
npm install -g db-migrate

g
npm install -g n

rimraf
npm install --save rimraf

cors
npm install --save cors

bcrypt
npm -i bcrypt npm -i -D @types/bcrypt

morgan
npm install --save morgan npm -i -D @types/morgan

jsonwebtoken
npm install jsonwebtoken --sav npm -i -D @types/jsonwebtoken

cross-env
npm install --save-dev cross-env

jasmine
npm install jasmine @types/jasmine @ert78gb/jasmine-ts ts-node --save-dev

supertest
npm i supertest npm i --save-dev @types/supertest

Set up Database
Create Databases
We shall create the dev and test database.

connect to the default postgres database as the server's root user psql -U postgres
In psql run the following to create a user
CREATE USER shopping_user WITH PASSWORD 'password123';
In psql run the following to create the dev and test database
CREATE DATABASE shopping;
CREATE DATABASE shopping_test;
Connect to the databases and grant all privileges
Grant for dev database
\c shopping
GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;
Grant for test database
\c shopping_test
GRANT ALL PRIVILEGES ON DATABASE shopping_test TO shopping_user;

