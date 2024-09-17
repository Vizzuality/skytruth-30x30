module.exports = {
  async up(knex) {
    // create postgis extension in the data schema
    await knex.raw("CREATE EXTENSION IF NOT EXISTS postgis SCHEMA data");
  },
};
