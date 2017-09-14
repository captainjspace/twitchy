# twitchy
* Vanilla JS
* Uses ES6 features
* Has gratuitous js to emphasize control of DOM
* template literals are awesome would never have used those unless going Vanilla

# The app
[Twitchy](https://captainjspace.github.io/twitchy/)
* Just type anything in search and hit enter or click search
* streams load...long description streams can mini-scroll.
* images will be loading in bg but screen might be a bit jumpy on initial loading
* images over http vs https - video had to be https
* images expand on rollover, click and vid player will load
* click is cancelled if the twitch channel is marked mature
* expanded limit to 100


## TODO
* could do with a refactor pass
* have fun with all the other data in the stream
* clean up css/app.css contains somewhat redundant formatting
* main app.js should be refined to a class with methods
* JSToken from Twitch for cleaner integration
* TwitchService should leverage offset to collect every stream
* pre-build image cache for of medium images in bg could be useful
