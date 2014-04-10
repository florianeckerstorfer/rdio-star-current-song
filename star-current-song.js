var rl = require("readline"),
    fs = require('fs'),
    Rdio = require(__dirname+"/rdio-simple/node/rdio"),
    config = require(__dirname+"/config");

var i = rl.createInterface(process.stdin, process.stdout, null);

function done() {
    i.close();
    process.stdin.destroy();
}

function addToPlaylist(rdio) {
    // Get a list of playlists.
    rdio.call("getPlaylists", {}, function (err, data) {
        if (err) {
            console.log("ERROR: " + err);
            done();
            return;
        }

        var playlists = data.result.owned;

        playlists.forEach(function (playlist) {
            if (config.STARRED_PLAYLIST_NAME == playlist.name) {
                starredPlaylist = playlist;
            };
        });

        var cmd = 'osascript -e \'tell application \"Rdio\" to get the key of the current track\'';
        require('child_process').exec(cmd, function (err, stdout, stderr) {
            if (err) {
                console.log("ERROR: " + err);
                done();
                return;
            };
            var track = { key: stdout.trim(), name: null };

            var cmd = 'osascript -e \'tell application \"Rdio\" to get the name of the current track\'';
            require('child_process').exec(cmd, function (err, stdout, stderr) {
                if (err) {
                    console.log("ERROR: " + err);
                    done();
                    return;
                };
                track.name = stdout.trim();
                var options = {
                    playlist: starredPlaylist.key,
                    tracks: [ track.key ]
                };

                rdio.call("addToPlaylist", options, function (err, data) {
                    if (err) {
                        console.log("ERROR: " + err);
                        done();
                        return;
                    }
                    console.log("Added track " + track.name + " to " + starredPlaylist.name + ".");
                });
            });
        });

        done();
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

    // Authenticate against the Rdio service.
    if (null === token) {
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

                    addToPlaylist(rdio);
                });
            });
        });
    } else {
        addToPlaylist(rdio);
    }
});
