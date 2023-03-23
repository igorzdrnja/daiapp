# Tessera challenge project

## Features

This project uses node.js with express, ethers.js, knex, and features the following rest endpoints:

### 1. /transactions

Retrieves last 100 indexed DAI transactions from the database by default. Query parameters:
- limit (number, limits the number of last transactions retrieved)
- offset (number, offsets the last transactions retrieved)

Example:
```
/transactions?limit=20&offset=3
```

### 2. /transactions/:address

Retrieves all the indexed DAI transactions from the database in which the stated address is either sender or receiver.

Example:
```
/transactions/0x1234567890123456789012345678901234567890
```

### 3. /balance/:address

Retrieves the calculated balance from the database for the address. Takes into account only the indexed/stored transactions for the address.

Example:
```
/balance/0x1234567890123456789012345678901234567890
```

### 4. /balance/onchain/:address

Retrieves the current balance from the onchain data for the address.

Example:
```
/balance/onchain/0x1234567890123456789012345678901234567890
```

## Extra routes:

### Health check:
```
/health
```

### Prometheus metrics:
```
/metrics
```

## Running the application

#### 1. Easy one liner using docker (you would need to have docker installed: https://docs.docker.com/get-docker/):
```
docker-compose up -d
```

#### 2. Manual setup

- You will need postgresql installed and running. https://www.postgresql.org/download/
- The default postgres user and password can be modified by setting env variables DB_ADMIN_USERNAME and DB_ADMIN_PASSWORD in .env.dev and .env.test files
- After the postgres is up, run:
```
npm start
```

## Additional commands

### Run migrations manually
```
npm run migrate
```

### Revert last migration manually
```
npm run migrate:down
```

### Run typescript checks
```
types:check
```


## TODOs
- Add more env vars / logic
- Add proper typing / ts support
- Improve documentation
