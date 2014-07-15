var settings = require('../../config/environment');
var pkg = require('../../../package');
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: pkg.version,
  addHelp: true,
  description: 'Last.FM Stream Listener Worker'
});
parser.addArgument([ '-l', '--lastfmUsername' ], {
  help: 'Last.FM Username'
});
parser.addArgument([ '-u', '--username' ], {
  help: 'Lines Per Beat Username'
});
var args = parser.parseArgs();
if(args.lastfmUsername === null || args.username === null) {
  return parser.printHelp();
}
var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
  api_key: settings.lastfm.apiKey,
  secret: settings.lastfm.secret,
  useragent: settings.lastfm.useragent
});
var db = require('../../components/database');

db.initialize('couchdb');
var users = db.getUsersTable();

var trackStream = lastfm.stream(args.lastfmUsername);
trackStream.on('nowPlaying', function (track) {
  console.log('Now Playing');
  console.log(track);
  db.searchByUser(args.username, function (error, reply) {
    if(error) {
      return console.log(error);
    }
    var user = reply.rows[0].value;
    user.lastfm.currentSong.artist = track.artist['#text'] || 'Unknown Artist';
    user.lastfm.currentSong.song = track.name || 'Unknown track';
    user.lastfm.currentSong.url = track.url || 'http://last.fm/404';
    user.lastfm.currentSong.lastUpdated = Date.now();
    db.insert(users, user._id, user, function (error) {
      if(error) {
        return console.log(error);
      }
    });
  });
});
trackStream.on('stoppedPlaying', function (track) {
  console.log('Stopped Playing');
  console.log(track);
  db.searchByUser(args.username, function (error, reply) {
    if(error) {
      return console.log(error);
    }
    var user = reply.rows[0].value;
    user.lastfm.currentSong.artist = '';
    user.lastfm.currentSong.song = '';
    user.lastfm.currentSong.url = '';
    user.lastfm.currentSong.lastUpdated = Date.now();
    db.insert(users, user._id, user, function (error) {
      if(error) {
        return console.log(error);
      }
    });
  });
});
trackStream.start();