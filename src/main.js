const debug = require('debug')('evolve-migrator:main');

const { subscription } = require('lib/gcp');
const handleSubscription = require('handleSubscription');

//start subscribing
subscription
  .get()
  .then(handleSubscription)
  .catch(err => {
    debug(err);
  });
