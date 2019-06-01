"use strict";

class AudioManager
{
    static volumeModifier = 1;

    static load()
    {
        var path = game.load.path;

        game.load.path = 'assets/audio/sfx/levels/';
        game.load.audio('open_door', 'open_door.mp3');

        game.load.path = path;
    }

    // play a sound with the given key
    static playSound(key, volume)
    {
        console.log(this.volumeModifier);
        
        var sound = game.add.audio(key, this.volumeModifier * volume);
        sound.playOnce = true;
        sound.play();

        return sound;
    }
}