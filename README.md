Star current song in Rdio
=========================

I like to keep a list of my favourite songs. iTunes has a five-star system, Spotify had, at least until recently, a little star icon beside each song. Rdio doesn't have a star functionality so I decided to implement it myself.

This repository contains a script written in Node.js (it also uses AppleScript, thus, OS X only) to add the currently playing track to a **Starred** playlist. You can use tools like Alfred or BetterTouchTool to configure a keyboard shortcut to execute the script.

Quick and dirty script, expect some terminal stuff.


Installation
------------

1. You need [Node.js](http://nodejs.org)
2. Clone this repository

```shell
$ git clone https://github.com/florianeckerstorfer/rdio-star-current-song
```

3. Clone the `rdio-simple` library into `rdio-simple/` (sorry, the library doesn't exist on NPM):

```shell
$ git clone https://github.com/rdio/rdio-simple rdio-simple
```

4. Create a [Rdio developer account](http://rdio.mashery.com)
5. Copy `config.js.dist` to `config.js`
6. Insert you consumer key and token into `config.js`
7. Insert the name of the playlist you want to use for starring songs in `config.js` (for example, `Starred`)
8. Run `node star-current-song.js`, open the displayed URL in your browser, allow access and copy the code back into the terminal
9. Setup a keyboard shortcut (or whatever)

### Alfred

1. Download the workflow
2. Open the workflow in Alfred
3. Add a keyboard shortcut
4. Double-click on the *Run Script* action and change the path to Node.js and the script

*Note:* If the keyboard shortcut does not work, use Alfreds *Debug Mode* to get error messages. To activate *Debug Mode* just click on the bug icon in the *Rdio Star Current Song* workflow.

### BetterTouchTool

1. Create a new global keyboard shortcut
2. Select *Execute Terminal Command* as action
3. Insert the following command, but change the path to Node.js and the script:

```shell
/usr/local/bin/node /usr/local/rdio-star-current-song/star-current-song.js
```

*Note:* If the keyboard shortcut does not work, check if you use the correct path to Node.js. For me, it didn't work when I used `node`; I had to use the full path to the `node` binary.


Changelog
---------

### Version 0.0.1 (10 April 2014)

- Intial release

Author
------

- [Florian Eckerstorfer](http://florian.ec) ([Twitter](http://twitter.com/Florian_))

License
-------

    The MIT License (MIT)

    Copyright (c) 2015 Florian Eckerstorfer

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
