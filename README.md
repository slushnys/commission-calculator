# Commission calculator

## Definition of the assignment

Create a RESTful API with an endpoint for transaction commission calculation. The API must use JSON format for requests and responses.

**Request (Transaction) examples**

*1st example*

```
{
  "date": "2021-01-01",
  "amount": "100.00",
  "currency": "EUR",
  "client_id": 42
}
```

*2nd example*

```
{
  "date": "2021-01-01",
  "amount": "200.40",
  "currency": "USD",
  "client_id": 42
}
```

**Response (Commission) example**

```
{
  "amount": "0.05",
  "currency": "EUR"
}
```

Commission response must **always** be in Euros. Please use a currency rates API ([https://api.exchangerate.host/2021-01-01](https://api.exchangerate.host/2021-01-01)) for transactions in currency other than Euros. 

### Commission calculation rules

The **lowest** commission shall be used if there are **multiple** rules matching.

**Rule #1: Default pricing**

By default the price for every transaction is `0.5%` but not less than `0.05€`.

**Rule #2: Client with a discount**

Transaction price for the client with ID of `42` is  `0.05€` (*unless other rules set lower commission*).

**Rule #3: High turnover discount**

Client after reaching transaction turnover of `1000.00€` (per month) gets a discount and transaction commission is `0.03€` for the following transactions.

See below an example in CSV format of rules applied to various transactions.

```jsx
client_id,date,amount,currency,commission_amount,commission_currency
42,2021-01-02,2000.00,EUR,0.05,EUR
1,2021-01-03,500.00,EUR,2.50,EUR
1,2021-01-04,499.00,EUR,2.50,EUR
1,2021-01-05,100.00,EUR,0.50,EUR
1,2021-01-06,1.00,EUR,0.03,EUR
1,2021-02-01,500.00,EUR,2.50,EUR
```

### Testing

Please write at least one unit and one integration test.

### Submitting the task

Upload the completed task to GitHub and send us a link to `code@kevin.eu`.

- Make sure you don't mention `kevin.` anywhere in the code or repository name.
- Please include how long it took for you to do the task.

### Remarks

- You can use any language and any framework. We expect you to show knowledge of your chosen language's ecosystem (frameworks, 3rd party libraries, etc.)
- Code must follow good practices (such as SOLID, design patterns, etc.) and be easily extendable in case we need to add additional commission calculation rules in the future
- Please include `README.md` with instructions how to run your completed task.


## Thought process

I wanted to go through a simple way possible for small amount of rules and make it flexible. I used quokka to skecth out the initial implementation in one page (if you know quokka), then created separate files to split responsibilities.

### Nice to have for the future
* Database - Currently there's a test where it acts as "transaction storage" database for monthly storages of transaction sums. Database would be better usage, but due to limits of time, I haven't implemented it here.
* Logger - logging things across functionality could be a big bonus
* Middlewares - separate input validation, parsing etc into middlewares.
* Infrastructure - to provision infrastructure with terraform 

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