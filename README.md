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

## Bonus stuff (from the challenge)
Check out the ```tools.ts``` file

## TODOs
- Add more env vars / logic
- Add proper typing / ts support
- Improve documentation

# Bonus: Basic part of challenge

### Improve the following code:

```
connectToDatabase()
.then((database)  => {
    return getUser(database, 'email@email.com')
    .then(user => {
        return getUserSettings(database, user.id)
        .then(settings => {
            return setRole(database, user.id, "ADMIN")
            .then(success => {
                return notifyUser(user.id, "USER_ROLE_UPDATED")
                .then(success => {
                    return notifyAdmins("USER_ROLE_UPDATED")
                })
            })
        })
    })
})
```

### Improved version:

```
try {
    const database = await connectToDatabase();
    const user = await getUser(database, 'email@email.com');
    const settings = await getUserSettings(database, user.id);
    const success = await setRole(database, user.id, "ADMIN");
    
    if (success) {
      const userNotified = await notifyUser(user.id, "USER_ROLE_UPDATED");
      if (userNotified) {
        await notifyAdmins("USER_ROLE_UPDATED");
      } else {
        throw new Error("Failed to notify user.");
      }
    } else {
      throw new Error("Failed to set user role.");
    }
} catch (error) {
	console.error(error); // or some different error processing
}
```

Changes and reasoning:
- Replaced the .then() chains with await keywords, which makes the code more readable and easier to understand.
- Added a try...catch block (and some errors with meaningful messages just as a showcase) to handle any errors that may occur during the execution of the asynchronous code.