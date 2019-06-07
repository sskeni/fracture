"use strict";

class MusicManager 
{
    game;

    currentSongKey;// The name of the current song
    currentSectionKey;// The name of the current section of the current song
    currentAudio;// The current Phaser.Sound instance
    nextAudio;// The next Phaser.Sound instance

    constructor()
    {
    }

    static loadMainMenu()
    {
        var path = game.load.path;
        game.load.path = 'assets/audio/music/';
        game.load.audio('main_menu_intro', 'main_menu_intro.ogg');
        game.load.audio('main_menu_body', 'main_menu_body.ogg');
        game.load.path = path;
    }

    static loadLevels()
    {
        var path = game.load.path;
        game.load.path = 'assets/audio/music/';
        game.load.audio('track_1_body', 'track_1.ogg');
        game.load.audio('track_2_body', 'track_2.ogg');
        game.load.path = path;
    }

    // starts playing the given song from the beginning
    playSong(key)
    {
        this.currentSongKey = key;

        if(game.cache.checkSoundKey(key + "_intro"))// if our song has an intro, play that
        {
            this.currentAudio = game.add.audio(key + "_intro");
            this.currentAudio.play('', 0, 0.5);
            this.loadSection("body");
            this.currentAudio.onStop.addOnce(this.playNextSection, this);// schedule the body to play following the intro
        }
        else// otherwise start with the body right away
        {
            this.playSection("body");
        }
    }

    // schedules the given section of the current song to play after the current loop of the current section ends
    transitionToSection(key)
    {
        if(typeof(this.currentAudio) == "undefined" || this.currentSectionKey == key)
        {
            return;
        }
        
        // clear current schedule
        this.currentAudio.onStop.removeAll(this);
        this.currentAudio.onLoop.removeAll(this);
        
        this.loadSection(key);
        
        //schedule the new key instead
        if(this.currentAudio.loop = true)
        {
            //this.currentAudio.onLoop.addOnce(this.playSectionOnLoop, this, 0, key);
            this.currentAudio.onLoop.addOnce(this.playNextSection, this);
        }
        else
        {
            //this.currentAudio.onStop.addOnce(this.playSectionOnStop, this, 0, key);
            this.currentAudio.onStop.addOnce(this.playNextSection, this);
        }

        this.currentSectionKey = key;
    }
    
    // dumps the arguments that the Sound.onStop event supplies before passing it to playSection
    playSectionOnStop(sound, marker, key)
    {
        this.playSection(key);
    }
    
    // dumps the arguments that the Sound.onLoop event supplies before passing it to playSection
    playSectionOnLoop(sound, key)
    {
        this.playSection(key);
    }

    loadSection(key)
    {
        this.nextAudio = game.add.audio(this.currentSongKey + "_" + key);
    }

    playNextSection()
    {
        if(typeof this.currentAudio !== "undefined")
        {
            if(this.currentAudio.isPlaying)
            {
                this.currentAudio.destroy();
            }
        }
        this.nextAudio.play('', 0, 0.5, true);
        this.currentAudio = this.nextAudio;
    }
    
    // immediately plays the given section of the current song
    playSection(key)
    {
        if(typeof this.currentAudio !== "undefined")
        {
            if(this.currentAudio.isPlaying)// Destroy the current audio to prevent songs stacking
            {
                this.currentAudio.destroy();
            }
        }
        this.currentAudio = game.add.audio(this.currentSongKey + "_" + key);
        this.currentAudio.play('', 0, 0.5, true);
    }

    // pause the current song
    pause()
    {
        this.currentAudio.pause();
    }

    // stop the current song entirely
    stop()
    {
        this.currentAudio.onStop.removeAll();
        this.currentAudio.stop();
    }

    // resume the current song
    resume()
    {
        this.currentAudio.resume();
    }
}