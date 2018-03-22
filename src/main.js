const knex = require('lib/db');
const debug = require('debug')('evolve-migrator:main');

const { subscription, publisher } = require('lib/gcp');

//start subscribing
subscription
  .get()
  .then(handleSubscription)
  .catch(err => {
    debug(err);
  });

async function handleSubscription([subscription]) {
  debug('Subscribed to "player-to-evolve" topic');

  subscription.on('message', async message => {
    message.ack();

    debug('Received new message');

    const payload = JSON.parse(message.data.toString('utf8'));
    const { evolve_id, playerme_id, table } = payload;

    const stream = getStream(table, evolve_id);

    stream.on('data', async data => {
      const dataToSend = {
        evolve_id,
        playerme_id,
        table,
        data,
      };

      debug('Sending %o', dataToSend);

      await publisher.publish(Buffer.from(JSON.stringify(dataToSend)));
    });

    stream.on('end', () => {
      debug(`Finished sending ${table} data for user ${evolve_id}`);
    });
  });
}

function getStream(table, evolve_id) {
  let queryBuilder = knex(table);

  switch (table) {
    case 'game_sessions':
      queryBuilder.where('player_id', evolve_id);
      break;
    default:
      throw new Error(`Unsupported table: ${table}`);
  }

  return queryBuilder.stream();
}
