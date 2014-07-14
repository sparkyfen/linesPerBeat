'use strict';

// Test specific configuration
// ===========================
module.exports = {
  env: 'test',
  couchdb: {
    url: 'http://localhost:5984',
    users: 'linesperbeat-test-user',
    childProcesses: 'linesperbeat-test-childprocesses'
  },
  crypto: {
    salt: 'hWFnCXuVM0aroBBF7Dcoue0AWFVpWL0H55PWgIZn4BkT3vmJnWasgcSELbuvCmt2' // 64+ character string.
  },
  cookie: {
    secret: 'ObFcII4xUa7eXnhosQG0bdoZesCgkOKH5CKEcGgLyx0eVeuib1LhFlweFAGVymtr' // 64+ character string.
  },
  lastfm: {
    apiKey: 'mockKey', // Last.FM API Key.
    secret: 'mockSecret', // Last.FM API Secret.
    useragent: 'LinesPerBeat/v0.1' // Some string to represent the useragent.
  },
  imgur: {
    clientId: 'mockClientId' //https://api.imgur.com/oauth2/addclient
  }
};