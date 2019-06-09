"use strict";

//state for gameplay
var Play = {
    preload:function()
    {
        game.load.path = 'assets/img/';

        //pause assets
        game.load.image('pause', 'pause.png');
        game.load.image('pauseBorder', 'pauseBorder.png');

        Player.load();
        TutorialManager.load();
        AudioManager.load();
        AudioManager.loadUI();
        TilemapManager.load();
        MusicManager.loadLevels();
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        //create player
        this.player = new Player(game, 0, 0);

        //create tilemap manager and add all the levels
        this.tilemapManager = new TilemapManager(this.player, 'Jake1');
        this.tilemapManager.addLevel('Ariana2');
        this.tilemapManager.addLevel('Ariana1');
        this.tilemapManager.addLevel('Ariana3');
        this.tilemapManager.addLevel('Sanchit1');
        this.tilemapManager.addLevel('Sanchit2');
        this.tilemapManager.addLevel('Jake2');
        
        //add the tilemapManager to the player so they can interact
        this.player.addTilemapManager(this.tilemapManager);
        
        //add pause menu
        this.pause = new Pause(game, Phaser.Keyboard.P);
        
        //add music manager and play level music
        this.musicManager = new MusicManager();
        this.musicManager.playSong('track_2');

        //add tutorial manager to display tutorial messages
        this.tutorialManager = new TutorialManager(this.player, 2);
    },

    update:function()
    {
        //update tilemap manager
        this.tilemapManager.update();

        //update tutorial manager
        this.tutorialManager.update();
    },

    render:function()
    {
        //update pause in render so it works while game is paused
        this.pause.update();
    },

    shutdown:function()
    {
        //stop music on end of state
        this.musicManager.stop();
    }
}