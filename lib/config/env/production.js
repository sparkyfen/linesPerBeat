'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,
  couchdb: {
    url: 'http://localhost:5984',
    users: 'linesperbeat-user'
  },
  crypto: {
    salt: 'hWFnCXuVM0aroBBF7Dcoue0AWFVpWL0H55PWgIZn4BkT3vmJnWasgcSELbuvCmt2'
  },
  cookie: {
    secret: 'ObFcII4xUa7eXnhosQG0bdoZesCgkOKH5CKEcGgLyx0eVeuib1LhFlweFAGVymtr'
  },
  lastfm: {
    api_key: 'b051db73d29fca802f3e4df2f061ad9a',
    secret: '7b7ab8c6a87374b0ce238c9bb361e0ea',
    useragent: 'LinesPerBeat/v0.1'
  }
};