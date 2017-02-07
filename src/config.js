'use strict';

const config = {
  getConnectionString() {
    if(process.env.NODE_ENV === 'production') {
      return `mongodb://${this.mongo.mongoProductionHosts.join(',')}/auth_prod?replicaSet=prod-rs0`; // eslint-disable-line
    }

    return `mongodb://mongo/auth_dev`;
  },
  mongo: {
    mongoProductionHosts: [
      'db0.cluster.na-kd.com',
      'db1.cluster.na-kd.com',
      'db2.cluster.na-kd.com'
    ]
  }
};

module.exports = config;
