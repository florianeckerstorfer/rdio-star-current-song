// rdio-star-current-song
// ======================
//
// Add the currently playing song to a Starred playlist in Rdio.
//
// (c) 2014 Florian Eckerstorfer <florian@eckerstorfer.co>
//
// The MIT License
//

var rl = require("readline"),
    fs = require('fs'),
    Rdio = require(__dirname+"/rdio-simple/node/rdio"),
    config = require(__dirname+"/config");

var i = rl.createInterface(process.stdin, process.stdout, null);

function done() {
    i.close();
    process.stdin.destroy();
}

// RdioStarCurrentSong
function RdioStarCurrentSong(rdio, starredPlaylistName) {
    this.rdio = rdio;
    this.starredPlaylistName = starredPlaylistName;
}

// Retrieves a value of the currently playing track from Rdio (using AppleScript) and calls `fn` with that value.
RdioStarCurrentSong.prototype.getCurrentTrackValue = function getCurrentTrackValue(name, fn) {
    var cmd = 'osascript -e \'tell application \"Rdio\" to get the ' + name + ' of the current track\'';
    require('child_process').exec(cmd, function (err, stdout, stderr) {
        if (err) {
            console.log("ERROR: " + err);
            done();
            return;
        };

        fn(stdout.trim());
    });
}

// Retrieves the key and name of the currently playing track and calls `fn` with a track object.
RdioStarCurrentSong.prototype.getCurrentTrack = function getCurrentTrack(fn) {
    var that = this;
    that.getCurrentTrackValue('key', function (key) {
        var track = { key: key, name: null };

        that.getCurrentTrackValue('name', function (name) {
            track.name = name;

            fn(track);
        });
    });
}

// Retrieves the list of playlists from Rdio and calls `fn` with the playlist as first and only argument.
RdioStarCurrentSong.prototype.getStarredPlaylist = function getStarredPlaylist(fn) {
    var that = this;
    this.rdio.call("getPlaylists", {}, function (err, data) {
        if (err) {
            console.log("ERROR: " + err);
            done();
            return;
        }

        var playlists = data.result.owned;

        playlists.forEach(function (playlist) {
            if (that.starredPlaylistName == playlist.name) {
                starredPlaylist = playlist;
            };
        });

        fn(starredPlaylist);
    });
}

// Adds the currently playing song to the Starred playlist.
RdioStarCurrentSong.prototype.addToPlaylist = function addToPlaylist() {
    // Get a list of playlists.
    var that = this;
    this.getStarredPlaylist(function (playlist) {
        that.getCurrentTrack(function (track) {
            var options = {
                playlist: starredPlaylist.key,
                tracks: [ track.key ]
            };

            that.rdio.call("addToPlaylist", options, function (err, data) {
                if (err) {
                    console.log("ERROR: " + err);
                    done();
                    return;
                }
                console.log("Added track " + track.name + " to " + starredPlaylist.name + ".");

                done();
            });
        });
    });
}

fs.readFile(__dirname+"/.user_config.json", function (err, data) {
    if (err) {
        var token = null;
        var rdio = new Rdio([config.RDIO_CONSUMER_KEY, config.RDIO_CONSUMER_SECRET]);
    } else {
        var token = JSON.parse(data);
        var rdio = new Rdio([config.RDIO_CONSUMER_KEY, config.RDIO_CONSUMER_SECRET], token);
    }
    var rdioStarCurrentSong = new RdioStarCurrentSong(rdio, config.STARRED_PLAYLIST_NAME);

    // Authenticate against the Rdio service.
    if (null === token) {
        // If we don't have a token, we need one. We can do this by generating an URL that the user can open in
        // the browser and then waiting for the user to enter the code generated by Rdio.
        rdio.beginAuthentication("oob", function (err, authUrl) {
            if (err) {
                console.log("ERROR: " + err);
                done();
                return;
            }

            console.log("Go to: " + authUrl);

            // Prompt the user for the verifier code.
            i.question("Then enter the code: ", function (verifier) {
                rdio.completeAuthentication(verifier, function (err) {
                    // Save the verifier token to a file so that we can later access it
                    fs.writeFile(__dirname+"/.user_config.json", JSON.stringify(rdio.token), function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("Saved authentication token.");
                        }
                    });
                    if (err) {
                        console.log("ERROR: " + err);
                        done();
                        return;
                    }

                    rdioStarCurrentSong.addToPlaylist();
                });
            });
        });
    } else {
        rdioStarCurrentSong.addToPlaylist();
    }
});
