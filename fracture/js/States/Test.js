var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');

        //tileset assets
        game.load.tilemap('test', 'test16x16.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('tilesheet', 'testtileset.png');
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        //create tileset and set collisions
        this.map = game.add.tilemap('test');
        this.map.addTilesetImage('testtileset', 'tilesheet');
        this.map.setCollisionByExclusion([]);

        //add tilset to map layer
        this.mapLayer = this.map.createLayer('Tile Layer 1');
        this.mapLayer.resizeWorld();

        //add p2 physics to tilemap
        game.physics.p2.convertTilemap(this.map, this.mapLayer);

        this.player = new Player(game, 100, 200, 'caretaker');
    },

    update:function()
    {
        //check collisions


        this.player.update();
    }
}