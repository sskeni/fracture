"use strict";

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
        MusicManager.loadLevels();
        HeartManager.load();
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        this.heartManager = new HeartManager();
        
        this.player = new Player(game, 200, 16);

        this.tilemapManager = new TilemapManager(this.player, 'ending');
        this.tilemapManager.mapLayer.tint = 0x134b6d;
        this.tilemapManager.startdoors.setAll('alpha', 0);
        //this.tilemapManager.addLevel('test');

        this.musicManager = new MusicManager();
        this.musicManager.playSong('track_2');

        //
        this.targetLocation = new Vector(216, 256);
    },

    update:function()
    {
        this.tilemapManager.update();
        this.setPlayerTint();

        if(this.player.body.x < 16)
        {
            this.player.body.x = 16;
        }

        if(!this.player.dead && this.targetLocation.x - this.player.x < 10)
        {
            this.playerTween = game.add.tween(this.player.body).to( { x: this.targetLocation.x }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);            
            this.playerTween.onComplete.addOnce(this.playAnimation, this);
        }
    },

    setPlayerTint:function()
    {
        var normalizedDistance = Math.abs(this.targetLocation.x - this.player.body.x)/216;
        this.player.tint = 0xffffff;
        this.player.tint -= (0x0000ff * normalizedDistance) << (8 * 2);
        this.player.tint -= (0x0000ff * normalizedDistance) << (8 * 1);
        this.player.tint -= 0x0000ff * normalizedDistance;
    },

    playAnimation()
    {
        if(this.player.stateManager.currentState == this.player.stateManager.ground)
        {
            this.player.playEndingCutscene();
            this.player.body.x = this.targetLocation.x;
            this.player.body.y = this.targetLocation.y;
            this.player.animations.getAnimation('ending').onComplete.addOnce(function(){
                game.time.events.add(1000, this.heartManager.playAnimation, this.heartManager);
            }, this);
        }
    },

    render:function()
    {
        //game.debug.pixel(200, 240, 'red', 32);
    }
}