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

var http = require('http');
var fs = require('fs');
var file = fs.readFileSync('build/realtimechem.json', 'utf8');
var tweets = JSON.parse(file);
var host = 'search.twitter.com';

var userMap = { };
var users = [ ];
var index = 0;

for (var tweetID in tweets) {
  var tweet = tweets[tweetID];

  userMap[tweet.from_user_id_str] = 'user';
}

for (var userID in userMap) {
  users.push(userID);
}

var onResponse = function(response) {
  if (response.statusCode === 404) {
    console.log('ERROR');

    index++;

    return;
  }

  var responseText = '';

  response.on('data', function(chunk) {
    responseText += chunk;
  });

  response.on('end', function() {
    json = JSON.parse(responseText)[0];

    userMap[json.id_str] = json;
  });

  index++;
};

var fetch = function() {
  if (index === users.length) {
    fs.writeFile('build/users.json', JSON.stringify(userMap, null, 2), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('JSON saved');
      }
    })
    clearInterval(interval);

    return;
  }

  var userID = users[index];
  console.log('fetching: ' + userID + ':' + index);

  http.request({
    host: host,
    path: 'https://api.twitter.com/1/users/lookup.json?user_id=' + userID
  }, onResponse).end();
}

// Twitter complains if too many requests. Hard limit: 150 request/hour
// ~ 2 req/min
var interval = setInterval(fetch, 30 * 1000);