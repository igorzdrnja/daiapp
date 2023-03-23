import Knex from 'knex'
import { commonConfig } from "../db/knexfile.js"
const knexCreate = Knex(commonConfig)
const knexSeed = Knex({
    ...commonConfig, connection: {
        database: process.env.POSTGRES_DB,
    },
})
// Create the database
async function createTestDatabase() {
    try {
        await knexCreate.raw(`DROP DATABASE IF EXISTS ${process.env.POSTGRES_DB}`)
        await knexCreate.raw(`CREATE DATABASE ${process.env.POSTGRES_DB}`)
    } catch (error) {
        throw new Error(error)
    } finally {
        await knexCreate.destroy()
    }
}

// Seed the database with schema and data
async function seedTestDatabase() {
    try {
        await knexSeed.migrate.latest()
        await knexSeed.seed.run()
    } catch (error) {
        throw new Error(error)
    } finally {
        await knexSeed.destroy()
    }
}

export default async () => {
    try {
        await createTestDatabase()
        await seedTestDatabase()
        console.log('Test database created successfully')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}