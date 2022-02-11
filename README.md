# Transaction fee calculator
## Thought process

I wanted to go through a simple way possible for small amount of rules and make it flexible. I used quokka to skecth out the initial implementation in one page (if you know quokka), then created separate files to split responsibilities.

### Nice to have for the future
* Database - Currently there's a test where it acts as "transaction storage" database for monthly storages of transaction sums. Database would be better usage, but due to limits of time, I haven't implemented it here. This could be covered using DynamoDB DataMapper implementation which would include types.
* Logger - logging things across functionality could be a big bonus
* Middlewares - separate input validation, parsing etc into middlewares.
* Infrastructure - to provision infrastructure with terraform 
* Parser - a more improved and extensive parser
* Number format - we could use bignumber.js package to have precise calculation of numbers.

## Running the application

### Install the packages

Install the packages using npm

```
npm install
```

### Run tests

```
npm run test
```

### Running the application offline

```
npm run start
```

### Query the endpoint

When the service is started, you can query the endpoint by using the outputed URL that you got from running the application, e.g.:

```
curl -d '{"amount": 500, "client_id": "1", "date":"2021-01-01", "currency": "EUR"}' http://localhost:3000/dev/comission-calculator/calculate
```

**NOTE: Keep in mind that due to this implementation not having a database, repetitive requests of certain amount for a customer ID won't be accumulated, therefore, it won't apply rules that require monthly volume of transactions.**