"use strict";

// manages dynamic transitions for the ending cutscene's music
class EndingMusicManager 
{
    ambiantBass;// a phaser sound holding the drone that plays before the cutscene begins
    bassBody;// a phaser sound holding the bass portion of the ending cutscene score
    body;// a phaser sound holding the melody and sfx portion of the ending score

    constructor()
    {
        // start the drone right away
        this.ambiantBass = game.add.audio('ending_bass_ambiant');
        this.ambiantBass.play('', 0, 0.5, true);
    }

    // loads all audio assets used for the ending cutscene
    static load()
    {
        var path = game.load.path;

        game.load.path = 'fracture/assets/audio/music/';
        game.load.audio('ending_bass_ambiant', 'ending_bass_ambiant.mp3');
        game.load.audio('ending_bass_body', 'ending_bass_body.mp3');
        game.load.audio('ending_body', 'ending_body.mp3');
        game.load.audio('ending_heartbeat', 'ending_heartbeat.mp3');

        game.load.path = path;
    }

    // begins the sound cue that plays when the character touches the heart
    touch()
    {
        // the body starts right away
        this.body = game.add.audio('ending_body');
        this.body.play('', 0, 0.5);

        // but the bass starts later for a smooth transition
        game.time.events.add(1000, function(){
            this.ambiantBass.stop();// we're done with the drone
            this.bassBody = game.add.audio('ending_bass_body');
            this.bassBody.play('', 0, 0.2);// play the bassline instead
        }, this);
    }

    // plays the heartbeat sfx
    static playHeartbeat()
    {
        var heartbeat = game.add.audio('ending_heartbeat');
        heartbeat.play('', 0, 0.5);
    }

    // stops all audio managed by this class entirely
    stop()
    {
        if(this.ambiantBass != null) this.ambiantBass.stop();
        if(this.bassBody != null) this.bassBody.stop();
        if(this.body != null) this.body.stop();
    }

}