module.exports = {
    async up(knex) {
        // create postgis extension in the data schema
        await knex.raw('DROP EXTENSION IF EXISTS postgis CASCADE');
        await knex.raw('CREATE EXTENSION postgis SCHEMA public');
    },
}