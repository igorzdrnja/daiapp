/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<import('knex').Knex.SchemaBuilder> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.string('sender').notNullable();
        table.string('recipient').notNullable();
        table.float('amount').notNullable();
        table.bigint('created_at').defaultTo(Math.floor(Date.now()));
    });

    await knex.schema.createTable('api_logs', (table) => {
        table.increments('id').primary();
        table.string('method').notNullable();
        table.string('url').notNullable();
        table.string('api_key').notNullable();
        table.string('body').notNullable();
        table.bigint('created_at').defaultTo(Math.floor(Date.now()));
    });
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<import('knex').Knex.SchemaBuilder> }
 */
export const down = async (knex) => {
    knex.schema.dropTable('transactions');
    knex.schema.dropTable('api_logs');
}
