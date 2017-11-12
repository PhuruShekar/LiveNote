#! /bin/sh

export DEBUG=true
$ npm install
$ webpack
$ js src/server/make_db.js
$ node src/server/server.js

