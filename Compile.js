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
var host = 'search.twitter.com';
var rootPath = '/search.json';
var queryPath = '?q=%23realtimechem';

var options = {
  host: host,
  path: rootPath + queryPath
};

var tweets = { };
var outputFilename = 'build/realtimechem.json';
var startDate = Date.parse('Sun, 21 Apr 2013 12:00:00 +0000');
var endDate = Date.parse('Sun 28 Apr 2013 12:00:00 +0000');
var lastDate = undefined;

fs.mkdir('build');

var pastLastDate = function() {
  return lastDate ? lastDate <= startDate : false;
};

var dateInRange = function(date) {
  console.log('test date:'+ date);
  return date >= startDate && date <= endDate;
};

var onResponse = function(response) {
  if (response.statusCode !== 200 || pastLastDate()) {
    console.log('Exit with status: ' + response.statusCode);

    fs.writeFile(outputFilename, JSON.stringify(tweets, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
    });

    return;
  }

  var responseText = '';

  response.on('data', function(chunk) {
    responseText += chunk;
  });

  response.on('end', function() {
    var json = JSON.parse(responseText);
    var currentTweets = [ ];

    for (var i = 0; i < json.results.length; i++) {
      var currentTweet = json.results[i];
      var date = Date.parse(currentTweet.created_at);

      if (dateInRange(date)) {
        tweets[currentTweet.id_str] = currentTweet;
      }

      currentTweets.push(currentTweet);
    }

    currentTweets.sort(function(first, second) {
      return Date.parse(first.created_at) - Date.parse(second.created_at);
    });

    console.log('Last tweet at: ' + currentTweets[0].created_at);
    console.log('Tweet count: ' + Object.keys(tweets).length);

    options.path = rootPath + queryPath + '&max_id=' + currentTweets[0].id_str;
    lastDate = Date.parse(currentTweets[0].created_at);

    console.log('request: ' + options.path);

    setTimeout(function() {
      http.request(options, onResponse).end();
    }, 500);
  });
};

http.request(options, onResponse).end();