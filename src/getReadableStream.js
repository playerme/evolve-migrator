const knex = require('lib/db');
const debug = require('debug')('evolve-migrator:getReadableStream');

/**
 * Returns a Readable Stream that streams a user's data in a specific table
 *
 * @param {*} table - name of table in evolve's database
 * @param {*} evolve_id - user_id in evolve's database
 */
module.exports = (table, evolve_id) => {
  debug('%o', { table, evolve_id });

  let queryBuilder = knex(table);

  switch (table) {
    case 'game_sessions':
      queryBuilder.where('player_id', evolve_id);
      break;
    default:
      throw new Error(`Unsupported table: ${table}`);
  }

  return queryBuilder.stream();
};
