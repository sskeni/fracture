var Play = {
    preload:function()
    {
        game.load.path = 'assets/img/';

        //pause assets
        game.load.image('pause', 'pause.png');
        game.load.image('pauseBorder', 'pauseBorder.png');

        //add levels
        game.load.path = 'js/Levels/';
        game.load.tilemap('level1', 'Ariana1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'Ariana3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'Ariana2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4', 'Sanchit1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level5', 'Sanchit2.json', null, Phaser.Tilemap.TILED_JSON);

        Player.load();
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
        
        this.player = new Player(game, 0, 0);

        this.tilemapManager = new TilemapManager(this.player, 'level1');
        this.tilemapManager.addLevel('level2');
        this.tilemapManager.addLevel('level3');
        this.tilemapManager.addLevel('level4');
        this.tilemapManager.addLevel('level5');

        this.player.addTilemapManager(this.tilemapManager);

        this.pause = new Pause(game, Phaser.Keyboard.P);

        this.musicManager = new MusicManager();
        this.musicManager.playSong('track_2');
    },

    update:function()
    {
        this.tilemapManager.update();
    },

    render:function()
    {
        this.pause.update();
    },

    //move each platform to account for anchor
    changeBody:function(platform)
    {
        platform.body.x = platform.x+platform.width/2;
        platform.body.y = platform.y+platform.height/2;
        platform.angle = platform.body.angle;
    },

    shutdown:function()
    {
        this.musicManager.stop();
    }
}