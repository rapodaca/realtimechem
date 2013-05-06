/**
 * Copyright (c) 2013 Richard L. Apodaca
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall
 * be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

// Ideas:
// https://api.twitter.com/1/users/lookup.json?user_id=323445568
// https://api.twitter.com/1/statuses/show.json?id=327466042802720768&include_entities=true
// https://developers.google.com/maps/documentation/javascript/tutorial#HelloWorld
// Get image URLs from statuses URL and 'media_url' + ':large'

var fs = require('fs');

var file = fs.readFileSync('build/realtimechem.json', 'utf8');
var tweets = JSON.parse(file);
var realTweetCount = 0;

var users = { };
var usersWithCoordinates = { };

for (var tweetID in tweets) {
  var tweet = tweets[tweetID];

  users[tweet.from_user] = 'user';

  if (tweet.from_user_name !== 'RealTimeChem') {
    realTweetCount++;
  }

  if (tweet.geo !== null) {
    usersWithCoordinates[tweet.from_user_id_str] = 'user'
  }
}

console.log('Users with geotags: ' + Object.keys(usersWithCoordinates).length);
console.log('Tweet count: ' + Object.keys(tweets).length);
console.log('Tweet count less RTC: ' + realTweetCount);
console.log('User count: ' + Object.keys(users).length);