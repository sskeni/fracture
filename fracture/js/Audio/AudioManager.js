"use strict";

// manager class for playing general audio
class AudioManager
{
    static volumeModifier = 1;
    static pauseAudio;
    static resumeAudio;

    // loads audio assets for levels
    static load()
    {
        // load non-phaser audio elements for pausing and unpausing
        this.pauseAudio = new Audio('fracture/assets/audio/sfx/ui/pause.mp3');
        this.resumeAudio = new Audio('fracture/assets/audio/sfx/ui/checkpoint.mp3');

        var path = game.load.path;
        game.load.path = 'fracture/assets/audio/sfx/levels/';

        game.load.audio('open_door', 'open_door.mp3');
        game.load.audio('begin_level', '../ui/begin_level.mp3');

        game.load.path = path;
    }

    // loads audio assets for the beginning cutscene
    static loadBeginning()
    {
        var path = game.load.path;

        game.load.path = 'fracture/assets/audio/music/';
        game.load.audio('beginning', 'beginning.mp3');

        game.load.path = path;
    }

    // loads audio assets for anything to do with UI
    static loadUI()
    {
        // load non-phaser audio element for swapping selections in the pause menu
        this.swapAudio = new Audio('fracture/assets/audio/sfx/ui/swap_selection.mp3');

        var path = game.load.path;
        game.load.path = 'fracture/assets/audio/sfx/ui/';

        game.load.audio('back', 'back.mp3');
        game.load.audio('start_game', 'start_game.mp3');
        game.load.audio('swap_selection', 'swap_selection.mp3');
        game.load.audio('select', 'select.mp3');

        game.load.path = path;
    }

    // plays a sound with the given key
    static playSound(key, volume)
    {
        var sound = game.add.audio(key, this.volumeModifier * volume);
        sound.playOnce = true;
        sound.play();

        return sound;
    }

    // plays the non-phaser audio element for pausing the game
    static playPauseSound()
    {
        this.pauseAudio.play();
    }
    
    // plays the non-phaser audio element for resuming the game
    static playResumeSound()
    {
        this.resumeAudio.play();
    }
    
    // plays the non-phaser audio element for swapping selections in the pause menu
    static playSwapSound()
    {
        this.swapAudio.play();
        this.swapAudio = new Audio('fracture/assets/audio/sfx/ui/swap_selection.mp3');
    }
}