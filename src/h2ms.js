//
//    h2ms - convert human time interval to milliseconds
//    forked from https://github.com/hacdias/human-to-milliseconds
//
'use strict';

const multipliers = {
  ns: 1e-6,
  us: 0.001,
  µs: 0.001,
  ms: 1,
  s: 1000,
  m: 60000,
  h: 3.6e+6,
  d: 24 * 3.6e+6,
  w: 7 * 24 * 3.6e+6,
  M: 30 * 24 * 3.6e+6,
  y: 365 * 24 * 3.6e+6
};
const mnames = Object.keys(multipliers).join('|');
const whole = new RegExp('^((\\d+(\\.\\d+)*)(' + mnames + '))+$');
const pieces = new RegExp('((\\d+(\\.\\d+)*)(' + mnames + '))', 'g');
const measure = new RegExp('(' + mnames + ')', 'g');

function analyse (time) {
  let unit = time.match(measure)[0];
  time = time.substring(0, time.length - unit.length);
  return parseFloat(time) * multipliers[unit];
}

module.exports = function h2ms (time) {
  time = '' + time;
  if (whole.test(time)) {
    return time.match(pieces).reduce((sum, cur) => { return sum + analyse(cur); }, 0);
  }

  return -1;
};
