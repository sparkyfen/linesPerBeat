LinesPerBeat
=============
Open-Source Hackathon Leaderboard

[![Build Status](https://travis-ci.org/brutalhonesty/linesPerBeat.svg?branch=master)](https://travis-ci.org/brutalhonesty/linesPerBeat)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Version
-------
0.1

License
-------
[MIT](https://tldrlegal.com/license/mit-license)

Home
-----
![Screenshot of home page](http://i.imgur.com/Td80ue3.png)

Login
-----
![Screenshot of login page](http://i.imgur.com/dR4A71k.png)

Register
--------
![Screenshot of register page](http://i.imgur.com/oroyA9G.png)

Edit Profile
------------
![Screenshot of edit profile page](http://i.imgur.com/6Ev0uSB.png)

Change Password
----------------
![Screenshot of change password page](http://i.imgur.com/IoqPaG3.png)

Link Accounts
--------------
![Screenshot of link accounts page](http://i.imgur.com/idLRpDl.png)

Get GruntFile
-------------
![Screenshot of get grunt file page](http://i.imgur.com/EdBGd5U.png)


TODO
-----
[Here](grunt-TODO.md)

API Docs
--------
[/docs/](docs/)

```bash
# Generate API Docs
grunt apidoc
```

Demo
------
http://linesperbeat.herokuapp.com/

Test
----
```bash
# Server-side testing
npm test
# Client-side testing
grunt build
```

Dependencies
------------
* [NodeJS](http://nodejs.org)
* [CouchDB](http://couchdb.apache.org)
* [Last.FM Account](http://www.last.fm/api)
* [Imgur Account](https://api.imgur.com)

Installation
------------
```bash
git clone <repo url>
cd /path/to/repo

# Start up DB
couchdb

# Install server-side dependencies & database structure for development
NODE_ENV=development npm install

# Install server-side dependencies & database structure for production
NODE_ENV=production npm install

# Don't forget to edit your configuration files at lib/config/env/

# Install client-side dependencies
bower install

# Development server startup
grunt serve

# Build for Production
grunt build
mv ./dist /path/to/production/location && cd /path/to/production/location

# Use Node to run
NODE_ENV=production IP=127.0.0.1 PORT=9000 node server.js

# Or use forever (https://github.com/nodejitsu/forever)
NODE_ENV=production IP=127.0.0.1 PORT=9000 forever start server.js

```