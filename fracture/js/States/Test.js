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

        //move platforms to account for anchor
        this.platforms.forEach(this.changeBody, this);

        //set platforms to kinematic
        this.platforms.setAll('body.kinematic', true);

        //add p2 physics to tilemap
        game.physics.p2.convertTilemap(this.map, this.mapLayer);

        //set colors for map
        color = Math.random() * 0xffffff;
        this.mapLayer.tint = color;
        this.platforms.setAll('tint', color);

        //create player
        this.player = new Player(game, 100, 200, 'caretaker');
    },

    update:function()
    {
        this.player.update();
    },

    //move each platform to account for anchor
    changeBody:function(platform)
    {
        platform.body.x = platform.x+platform.width/2;
        platform.body.y = platform.y+platform.height/2;
    }
}