"use strict";

class AudioManager
{
    static volumeModifier = 1;
    static pauseAudio;
    static resumeAudio;

    static load()
    {
        // load non-phaser audio element for pausing
        this.pauseAudio = new Audio('assets/audio/sfx/ui/pause.mp3');
        this.resumeAudio = new Audio('assets/audio/sfx/ui/checkpoint.mp3');

        var path = game.load.path;

        game.load.path = 'assets/audio/sfx/levels/';
        game.load.audio('open_door', 'open_door.mp3');
        //game.load.audio('checkpoint', '../ui/checkpoint.mp3');
        game.load.audio('begin_level', '../ui/begin_level.mp3');
        game.load.audio('complete_level', '../ui/complete_level.mp3');

        

        game.load.path = path;
    }

    static loadUI()
    {
        var path = game.load.path;

        game.load.path = 'assets/audio/sfx/ui/';
        game.load.audio('back', 'back.mp3');
        game.load.audio('start_game', 'start_game.mp3');
        game.load.audio('swap_selection', 'swap_selection.mp3');
        game.load.audio('select', 'select.mp3');
        //game.load.audio('se', 'back.mp3');

        

        game.load.path = path;
    }

    // play a sound with the given key
    static playSound(key, volume)
    {
        var sound = game.add.audio(key, this.volumeModifier * volume);
        sound.playOnce = true;
        sound.play();

        return sound;
    }

    static playPauseSound()
    {
        this.pauseAudio.play();
    }

    static playResumeSound()
    {
        this.resumeAudio.play();
    }
}