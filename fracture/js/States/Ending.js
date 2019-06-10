"use strict";

//state for ending cutscene
var Ending = {
    preload:function()
    {
        game.load.path = 'assets/img/';

        //add levels
        game.load.path = 'js/Levels/';
        //game.load.tilemap('test', 'test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('ending', 'ending.json', null, Phaser.Tilemap.TILED_JSON);

        Player.load();
        AudioManager.load();
        TilemapManager.load();
        //MusicManager.loadLevels();
        HeartManager.load();
        EndingMusicManager.load();
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        //create heart
        this.heartManager = new HeartManager();
        
        //create player
        this.player = new Player(game, 200, 16);

        //load tileset for cutscene level
        this.tilemapManager = new TilemapManager(this.player, 'ending');
        this.tilemapManager.mapLayer.tint = 0x134b6d;

        //make startdoor invisible
        this.tilemapManager.startdoors.setAll('alpha', 0);

        //start music manager for end cutscene
        this.musicManager = new EndingMusicManager();

        //target location to start cutscene
        this.targetLocation = new Vector(216, 256);
    },

    update:function()
    {
        //update tilemap manager
        this.tilemapManager.update();

        //set player tint
        this.setPlayerTint();

        //make player stick to position for cutscene
        if(this.player.body.x < 16)
        {
            this.player.body.x = 16;
        }

        //move player to correct position and start cutscene animation
        if(!this.player.dead && this.targetLocation.x - this.player.x < 10)
        {
            this.playerTween = game.add.tween(this.player.body).to( { x: this.targetLocation.x }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);            
            this.playerTween.onComplete.addOnce(this.playAnimation, this);
        }
    },

    //sets player tint based on position
    setPlayerTint:function()
    {
        var normalizedDistance = Math.abs(this.targetLocation.x - this.player.body.x)/216;
        this.player.tint = 0xffffff;
        this.player.tint -= (0x0000ff * normalizedDistance) << (8 * 2);
        this.player.tint -= (0x0000ff * normalizedDistance) << (8 * 1);
        this.player.tint -= 0x0000ff * normalizedDistance;
    },

    //play ending cutscene
    playAnimation()
    {
        if(this.player.stateManager.currentState == this.player.stateManager.ground)
        {
            //setup player for end cutscene
            this.player.playEndingCutscene();

            //set player to correct position
            this.player.body.x = this.targetLocation.x;
            this.player.body.y = this.targetLocation.y;

            //play players animation and play heart animation after
            this.player.animations.getAnimation('ending').onComplete.addOnce(function(){
                this.musicManager.touch();
                game.time.events.add(1000, this.heartManager.playAnimation, this.heartManager);
            }, this);
        }
    }
}