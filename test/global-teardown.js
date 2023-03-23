import Knex from 'knex'
import { commonConfig } from "../db/knexfile.js"

const knex = Knex(commonConfig)
export default async () => {
    try {
        await knex.raw(`DROP DATABASE ${process.env.POSTGRES_DB} WITH (FORCE)`)
        process.exit(1)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}