var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');
        game.load.image('shard', 'Shard.png');
        game.load.image('cursorBase', 'cursorBase.png');
        game.load.image('cursorTip', 'cursorTip.png');

        //tileset assets
        game.load.image('smallplatform', 'smallplatform.png');
        game.load.image('mediumplatform', 'mediumplatform.png');
        game.load.image('largeplatform', 'largeplatform.png');
        game.load.tilemap('test', 'test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('tilesheet', 'testtileset.png');

        Player.load();
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        
        this.player = new Player(game, 100, 200, 'caretaker');

        this.tilemapManager = new TilemapManager(this.player);


        //this.cursorBase = game.add.image(200, 200, 'cursorBase');
    },

    update:function()
    {
        //this.player.update();
    },

    //move each platform to account for anchor
    changeBody:function(platform)
    {
        platform.body.x = platform.x+platform.width/2;
        platform.body.y = platform.y+platform.height/2;
        platform.angle = platform.body.angle;
    }
}