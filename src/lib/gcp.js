const PubSub = require('@google-cloud/pubsub');
const pubsub = PubSub({
  projectId: 'playerdotme-1121',
});

const writeTopic = pubsub.topic('evolve-to-player');
const publisher = writeTopic.publisher();

const readTopic = pubsub.topic('player-to-evolve');
const subscription = readTopic.subscription('evolve-migrator');

module.exports = {
  subscription,
  publisher,
};
