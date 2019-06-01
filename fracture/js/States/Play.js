var Play = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');
        game.load.image('shard', 'Shard.png');
        game.load.image('cursorBase', 'cursorBase.png');
        game.load.image('cursorTip', 'cursorTip.png');

        //tileset assets
        game.load.image('startdoor', 'startdoor.png');
        game.load.image('enddoor', 'enddoor.png');
        game.load.image('button', 'button.png');
        game.load.image('spike', 'spike.png');
        game.load.image('door', 'door.png');
        game.load.image('checkpoint', 'checkpoint.png');
        game.load.spritesheet('tilesheet', 'tileset.png');

        //pause assets
        game.load.image('pause', 'pause.png');

        //add levels
        game.load.path = 'js/Levels/';
        game.load.tilemap('test', 'test.json', null, Phaser.Tilemap.TILED_JSON);

        Player.load();
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
    },

    update:function()
    {
        this.tilemapManager.update();
    },

    //move each platform to account for anchor
    changeBody:function(platform)
    {
        platform.body.x = platform.x+platform.width/2;
        platform.body.y = platform.y+platform.height/2;
        platform.angle = platform.body.angle;
    }
}