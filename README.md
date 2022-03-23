# Gateway App

### 1. This project cointains two separate apps for frontend and backend:

[Backend on GitHub](https://github.com/manglynho/rml_gateways)

[Frontend on GitHub](https://github.com/manglynho/rml_gateways_frontend)

-In both cases after cloning from github run:

>npm install

-Start each project with command:

>npm start

Backend already contains a frontend build and it's ready for separated work. 

### 2. Database
The project uses mongoDB. I already setup two databases for production and test. 

Im sharing the **.env** with connection data, but you can use your own setup. 

### 3. Requests
I wrote two requests files (./requests/ ) that can be used to test the api. 
You can run those using VsCode or copy the info to Postman.

### 4. Tests
Test suites are stored in the test folder and contain jest tests and data for main requirements and validation.

Also there are a test for the GatewayForm component in frontend app.

Trigger test with command:
>npm run test

Frontend has a test suite implemented with Cypress that you can start with the command: 
>npm run cypress:open

### 5. Since the Backend it's the main result for this task i already setup a Heroku App for automatic deploys. 
So any changes commited to the backend repo will be deployed automaticaly on the heroku app created.

[Gateway App on Heroku](https://reiner-gateways-app.herokuapp.com)
