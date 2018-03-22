const { publisher } = require('lib/gcp');
const getReadableStream = require('getReadableStream');

const debug = require('debug')('evolve-migrator:handleSubscription');

module.exports = async function handleSubscription([subscription]) {
  debug('Subscribed to "player-to-evolve" topic');

  subscription.on('message', async message => {
    // we don't know how long the data is going to be streamed,
    // so we should just acknowledge the receipt of the message immediately
    // rather than wait until all the data is streamed, otherwise we might
    // run into the problem wherein multiple instances process the same message
    message.ack();

    debug('Received new message');

    const payload = JSON.parse(message.data.toString('utf8'));
    const { evolve_id, playerme_id, table } = payload;

    //send message to announce start of send stream
    await publisher.publish(
      Buffer.from(
        JSON.stringify({ type: 'start', evolve_id, playerme_id, table })
      )
    );

    const stream = getReadableStream(table, evolve_id);

    stream.on('data', async data => {
      const dataToSend = {
        type: 'data',
        evolve_id,
        playerme_id,
        table,
        data,
      };

      debug('Sending %o', dataToSend);

      await publisher.publish(Buffer.from(JSON.stringify(dataToSend)));
    });

    stream.on('end', async () => {
      //send message to announce start of send stream
      await publisher.publish(
        Buffer.from(
          JSON.stringify({ type: 'end', evolve_id, playerme_id, table })
        )
      );

      debug(`Finished sending ${table} data for user ${evolve_id}`);
    });
  });
};
