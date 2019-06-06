"use strict";

class EndingMusicManager 
{
    game;

    ambiantBass;
    bassBody;
    body;

    constructor()
    {
        this.ambiantBass = game.add.audio('ending_bass_ambiant');
        this.ambiantBass.play('', 0, 0.5, true);
    }

    static load()
    {
        var path = game.load.path;
        game.load.path = 'assets/audio/music/';
        game.load.audio('ending_bass_ambiant', 'ending_bass_ambiant.mp3');
        game.load.audio('ending_bass_body', 'ending_bass_body.mp3');
        game.load.audio('ending_body', 'ending_body.mp3');
        game.load.audio('ending_heartbeat', 'ending_heartbeat.mp3');
        game.load.path = path;
    }

    touch()
    {
        this.body = game.add.audio('ending_body');
        this.body.play('', 0, 0.5);
        game.time.events.add(1000, function(){
            this.ambiantBass.stop();
            this.bassBody = game.add.audio('ending_bass_body');
            this.bassBody.play('', 0, 0.2);
        }, this);
    }

    static playHeartbeat()
    {
        var heartbeat = game.add.audio('ending_heartbeat');
        heartbeat.play('', 0, 0.5);
    }

    // stop the current song entirely
    stop()
    {
        if(this.ambiantBass != null) this.ambiantBass.stop();
        if(this.bassBody != null) this.bassBody.stop();
        if(this.body != null) this.body.stop();
    }

}