# Emi's House of Games API

## Introduction

The purpose of this API is to programmatically access application data, with the intention of providing this information to inform front end development. This API project mimicks the building of a real world backend service, and the created database is stored and managed using PSQL.

## API link

The link to the created API is: https://emi-games.herokuapp.com/

---

## Set up instructions

### **Cloning the repo**

Prerequisites

- Basic knowledge of the terminal
- Git installed
- A GitHub account

In order to clone this repository, use the terminal command:

```json
git clone https://github.com/Emikokobeans/be-nc-games.git
```

### **Install dependencies**

To install all the relevant dependencies, use the terminal command:

```json
npm i
```

To run tests, the dev dependencies will need to be manually installed using the command:

```json
npm install --only=dev
```

### **Seed the local database**

For the API to function, the database will first need to be seeded. The database can be interacted using [node-postgres](https://node-postgres.com/).

To seed the database, enter the command:

```json
node ./db/seeds/run-seed.js
```

### **Run tests**

To ensure the database and API are fully functioning, the provided tests can be run with the following command:

```json
npm test
```

### **Create .env files**

_Two_ `.env` files will need to be created: `.env.test` and `.env.development`.

Add into `.env.test`:

```json
PGDATABASE = nc_games_test
```

Add into `.env.development`:

```json
PGDATABASE = nc_games
```

---

### **Node.js and Postgres**

The minimum versions needed to run this project:

- `node.js`: v16.1.0
- `Postgres`: v8.6.0
