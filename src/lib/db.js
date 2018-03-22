const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

module.exports = pg;
