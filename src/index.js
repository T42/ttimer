#!/usr/bin/env node
//
//    ttimer - cli for precision tea timing
//

const pkg = require('../package');
const myname = pkg.name;
const myversion = pkg.version;

const h2ms = require('./h2ms');
const pms = require('pretty-ms');
const ttimers = {};

if(process.argv.length<3) { usage(); process.exit(1); };
init( process.argv.slice(2) );

function log() { console.log( jetzt(), ...arguments ); }
function jetzt() { return ( new Date().toISOString().slice(0,19) ).replace('T',' '); }
function usage() { console.log("  usage: %s <interval> [<interval> ...]", myname); }

function init( args ) {
  console.log('\u001Bc%s %s v%s ready.',jetzt(), myname, myversion);
  args.forEach( (s) => {
    let ms = h2ms(s);
    if(ms > 0) {
      timerstart( 'Tea is ready ' + pms(ms,{verbose:true}) + ' after ' + jetzt(), ms );
    } else {
      console.error('ERROR: invalid input. ('+s+')');
    };
  });
  setInterval(heartbeat,1000);
}

function heartbeat() {
  if( ! Object.keys(ttimers).length ) {
    log('no more ttimers. exiting.');
    process.exit(0);
  };
}

function timerstart(ttname,ttms) {
  if( ttimers[ttname] ) return;
  let tt=Object.assign({}, { name:ttname, ms:ttms, starttime:Date.now() });
  log('new ttimer \'' + tt.name + '\'.');
  ttimers[tt.name] = tt;
  setTimeout( timeralarm, tt.ms, tt);
}

function timeralarm (tt) {
  if(!tt) return;
  log( 'ttimer ALARM\u0007 (', tt.name, ')');
  delete ttimers[tt.name];
}

