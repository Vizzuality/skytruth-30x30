module.exports = {
    async up(knex) {
      // change the relation from 1:1 to 1:n without losing data
      // add a data_tool_resource_type_order column
      // await knex.schema.table('data_tools_data_tool_resource_type_links', table => {
      //     table.integer('data_tool_resource_type_order');
      // });
      // // populate the reorder column with 1
      // await knex.raw('UPDATE data_tools_data_tool_resource_type_links SET data_tool_resource_type_order = 1');
      // // make the column not nullable
      // await knex.schema.alterTable('data_tools_data_tool_resource_type_links', table => {
      //     table.integer('data_tool_resource_type_order').notNullable().alter();
      // });
      // // rename the table to match strapi convention
      // await knex.schema.renameTable('data_tools_data_tool_resource_type_links', 'data_tools_data_tool_resource_types_links');
    },
}
