####RealTimeChem

These are some quick Node.js scripts I cooked up to analyze the Tweets from [RealTimeChem Week](http://doctorgalacticandthelabcoatcowboy.wordpress.com/2013/03/26/real-time-chem-week-the-faq/) during April 2013.

This project is also an experiment to test the limits of the [Twitter Search API](https://dev.twitter.com/docs/api/1/get/search). It turns out you can to a lot with this API, but the rules can be restrictive. As an example, see Users.js, in which a 30-second timeout request needed to be implemented to prevent lockout.

Run Compile.js first, followed by Users.js and optionally Stats.js:

$ node Compile.js