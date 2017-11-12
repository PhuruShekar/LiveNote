#! /bin/sh

export DEBUG=true
 npm install
 npm prune
 webpack
 js src/server/make_db.js
 node src/server/server.js

