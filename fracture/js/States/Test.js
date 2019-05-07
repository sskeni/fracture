var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');
        game.load.image('shard', 'Shard.png');

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
        
        //add tileset to map layer
        this.mapLayer = this.map.createLayer('Tile Layer 1');
        this.mapLayer.resizeWorld();
        
        //add p2 physics to tilemap
        this.map.setCollisionByExclusion([]);
        game.physics.p2.convertTilemap(this.map, this.mapLayer);
        this.tilemapCollisionGroup = game.physics.p2.createCollisionGroup();
        var tilemapBodies = game.physics.p2.convertTilemap(this.map, this.mapLayer);

        this.player = new Player(game, this.mapLayer, this.tilemapCollisionGroup, 100, 200, 'caretaker');

        for(let index in tilemapBodies)
        {
            tilemapBodies[index].setCollisionGroup(this.tilemapCollisionGroup);
            tilemapBodies[index].collides(this.player.collisionGroup);
            tilemapBodies[index].collides(this.player.shardCollisionGroup);
            tilemapBodies[index].tag = 'tile';
        }
        
        
    },

    update:function()
    {
        this.player.update();
    }
}