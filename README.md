<div align="center">
<h1>Banking API 💰</h1>
</div>

# Table of Contents

- [Requirements](#requirement)
- [Dependencies](#dependencies)
- [Install](#install)
- [Run locally](#run-locally)
- [APIs](./src/infrastructure/http/README.md)
- [Test](#test)

## Requirement

- [NodeJS](https://nodejs.org/en/) >= `v12.18.2`

## Dependencies

- [PostgreSQL](https://www.postgresql.org/docs/) >= `12`

## Install

Using [Docker](https://docs.docker.com/get-docker/) to install all server dependencies.

### Start a PostgreSQL server locally

You can configure in your .env file

| Environment variable | Description                | Default value |
| -------------------- | -------------------------- | ------------- |
| POSTGRES_HOSTNAME    | postgreSQL server hostname | localhost     |
| POSTGRES_DATABASE    | postgreSQL server database | local         |
| POSTGRES_PORT        | postgreSQL server port     | 5432          |
| POSTGRES_USERNAME    | postgreSQL server username | local         |
| POSTGRES_PASSWORD    | postgreSQL server password | local         |

```bash
$ docker-compose up -d
```

### Initialize your PostgreSQL server

```bash
$ npm run migration:up:local
```

### Start server locally

| Environment variable | Description     | Default value |
| -------------------- | --------------- | ------------- |
| APP_NAME             | server app name | banking       |
| APP_PORT             | server app port | 3000          |

```bash
$ git clone git@github.com:jaunecitron/banking.git
$ cd banking
$ npm install
$ npm run start:local
```

## Run locally

```bash
$ npm run start:local
# Watch mode
$ npm run start:watch
```

## Test

```bash
$ npm test
# TDD
$ npm run test:watch
```
