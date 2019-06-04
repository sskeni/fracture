var Play = {
    preload:function()
    {
        game.load.path = 'assets/img/';

        //pause assets
        game.load.image('pause', 'pause.png');

        //add levels
        game.load.path = 'js/Levels/';
        game.load.tilemap('test', 'test.json', null, Phaser.Tilemap.TILED_JSON);

        Player.load();
        AudioManager.load();
        TilemapManager.load();
        MusicManager.loadLevels();
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        
        this.player = new Player(game, 0, 0);

        this.tilemapManager = new TilemapManager(this.player, 'test');
        this.tilemapManager.addLevel('test');

        this.pause = new Pause(game, Phaser.Keyboard.P);

        this.musicManager = new MusicManager();
        this.musicManager.playSong('track_2');
    },

    update:function()
    {
        this.tilemapManager.update();
    }
}