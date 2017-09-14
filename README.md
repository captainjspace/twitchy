# twitchy
* cool Vanilla JS
* Uses ES6 features: classes, Promises, template literals
  * template literals are awesome would never have used those unless going Vanilla

## meh stuff
* 800px width,
* some gratuitous js to emphasize control of DOM...

# The app
[Twitchy](https://captainjspace.github.io/twitchy/)
* Just type anything in search and hit enter or click search
* streams load...long description streams can mini-scroll.
* item code will be loading in bg but leaves cache mgmt to browser
* images over http vs https - video had to be https
* images expand on rollover, click and vid player will load
* click is cancelled if the twitch channel is marked mature
* expanded limit to 100, did not add offset loop but would ...

# Note
* Twitch is phasing out JSONP - it's on their docs page.
* Wrapped a Promise around an XHR2 requests
  * XHR2 does not have any cross origin issues
  * Avoids unnecessary manipulation of the DOM
  * Looks cleaner than JSONP, has more info, more error information.
* Can redo TwitchService JSONP style if that's important :)

## TODO
* could do with a refactor pass
* have fun with all the other data in the stream
* clean up css/app.css contains some redundant formatting
* main app.js functions should be refined into single object
* JSToken from Twitch for cleaner integration
* TwitchService should leverage offset to collect every stream
* pre-build image cache more aggressively
* maybe do something with bigger images in bg could be useful
* proper responsive design, functional but wide on my iPhone...
* tests...

### Browsers checked
* Safari 10.0.1
* Chrome Version 60.0.3112.113 (Official Build) (64-bit)
* iOS 10.3.3 (14G60), Safari
