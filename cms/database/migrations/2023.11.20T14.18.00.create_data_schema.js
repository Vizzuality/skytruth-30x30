module.exports = {
    async up(knex) {
        // create new schema called data
        await knex.raw('CREATE SCHEMA data');
    },
};