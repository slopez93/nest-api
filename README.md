# NEST JS API

This is a repo that contain api in **NestJS**

## 🪒 Note 

**If you want to run project in local, remember:**

- NodeJS 12.x
- Yarn


## 🚀 Start

**Start with docker** 👌

``` bash
docker-compose up
```

*Start dev server*

``` bash
yarn run start:dev
```

## 📜 Installation

Install packages with:

``` bash
yarn install
```

## 🧪 Tests

To run unit and integration test:

``` bash
yarn test
```

To run e2e test:

``` bash
yarn test:e2e
```

## ✅ API

#### **POST - CREATE ACCOUNT - http://0.0.0.0:5000/prod/accounts**

Request example:

```json
{
  "operation": "BUY",
  "issuer_name": "NFLA",
  "total_shares": 1,
  "share_price": 5,
}
```

#### **POST - SEND ORDER INTO ACCOUNT - http://0.0.0.0:5000/prod/accounts/:id/orders**

Request example:

```json
{
  "operation": "BUY",
  "issuer_name": "NFLA",
  "total_shares": 1,
  "share_price": 1
}
```

## 📚 Consierations

- I have used **docker compose** for container api withdatabase
- I have user **Serverless** with **Express**
- I have used **Dynamodb** as DB
- **Jest** and **ts-mockito** to unit and integration testing

### Server

- Pending implemente swagger or postman collection
- Pending add husky to pass test and linter when you push to remote branch
- Penging split serverless.yml in resources file
- I did the important test (35). Pending do the restants