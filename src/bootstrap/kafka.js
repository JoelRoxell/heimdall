'use strict';

const kafka = require('kafka-node');
const fs = require('fs');
const path = require('path');

const secretPassage = path.join(__dirname, '../../.ssh/');
const publicKey = fs.readFileSync(path.join(secretPassage, 'secret.pub'));

const client = new kafka.Client(
  `${process.env.KAFKA_HOST}:${process.env.ZOOKEEPER_PORT}/`,
  require('../../package.json').name // Use the package name
);

const producer = new kafka.Producer(client);
const newPkTopic = 'heimdall_new_pk_test';

function createConsumer() {
  const consumer = new kafka.Consumer(client, [
     { topic: newPkTopic }
  ], {
    groupId: 'heimdall'
  });

  consumer.on('message', function(message) {
    console.log('did recieve a message');
    console.log(message);
  });

  consumer.on('error', function(err) {
    console.log(err);
  });

  return consumer;
}

function sendBootNotification() {
  producer.send([
    {
      topic: newPkTopic,
      messages: [JSON.stringify({
        pk: publicKey.toString('utf8')
      })]
    }
  ], function(err, data) {
    if(err) {
      console.log(err);
    }

    console.log(data);
  });
}

function onReady() {
  producer.createTopics(['heimdall_new_pk'], function(err, res) {
    if(err) {
      return console.log(err);
    }

    createConsumer();
    sendBootNotification();
  });
}

function onError(err) {
  console.error(err);
}

producer.on('ready', onReady);
producer.on('error', onError);
