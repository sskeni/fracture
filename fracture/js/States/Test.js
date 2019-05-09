var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');

        //tileset assets
        game.load.image('smallplatform', 'smallplatform.png');
        game.load.tilemap('test', 'test.json', null, Phaser.Tilemap.TILED_JSON);
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
        this.mapLayer = this.map.createLayer('walls');
        this.mapLayer.resizeWorld();

        //add platforms
        this.platforms = game.add.group();
        this.platforms.enableBody = true;
        this.platforms.physicsBodyType = Phaser.Physics.P2JS;
        this.map.createFromObjects('smallplatforms', 5, 'smallplatform', 0, true, false, this.platforms);
        this.platforms.setAll('body.static', true);

        //the next line changes the sprite to be set to the right position
        //this.platforms.setAll('anchor', 0);

        //I tried the next line, but it didn't seem to do anything
        //this.platforms.setAll('body.anchor', null, 0);

        //add p2 physics to tilemap
        game.physics.p2.convertTilemap(this.map, this.mapLayer);

        this.player = new Player(game, 100, 200, 'caretaker');
    },

    update:function()
    {
        this.player.update();
    }
}