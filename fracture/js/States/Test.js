var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');

        //tileset assets
        game.load.image('smallplatform', 'smallplatform.png');
        game.load.image('mediumplatform', 'mediumplatform.png');
        game.load.image('largeplatform', 'largeplatform.png');
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

        //add small platforms
        this.smallplatforms = game.add.group();
        this.smallplatforms.enableBody = true;
        this.smallplatforms.physicsBodyType = Phaser.Physics.P2JS;
        this.map.createFromObjects('smallplatforms', 5, 'smallplatform', 0, true, false, this.smallplatforms);

        //add medium platforms
        this.mediumplatforms = game.add.group();
        this.mediumplatforms.enableBody = true;
        this.mediumplatforms.physicsBodyType = Phaser.Physics.P2JS;
        this.map.createFromObjects('mediumplatforms', 6, 'mediumplatform', 0, true, false, this.mediumplatforms);

        //add large platforms
        this.largeplatforms = game.add.group();
        this.largeplatforms.enableBody = true;
        this.largeplatforms.physicsBodyType = Phaser.Physics.P2JS;
        this.map.createFromObjects('largeplatforms', 7, 'largeplatform', 0, true, false, this.largeplatforms);

        //move platforms to account for anchor
        this.smallplatforms.forEach(this.changeBody, this);
        this.mediumplatforms.forEach(this.changeBody, this);
        this.largeplatforms.forEach(this.changeBody, this);

        //set platforms to kinematic
        this.smallplatforms.setAll('body.kinematic', true);
        this.mediumplatforms.setAll('body.kinematic', true);
        this.largeplatforms.setAll('body.kinematic', true);

        //add p2 physics to tilemap
        game.physics.p2.convertTilemap(this.map, this.mapLayer);

        //set colors for map
        color = Math.random() * 0xffffff;
        this.mapLayer.tint = color;
        this.smallplatforms.setAll('tint', color);
        this.mediumplatforms.setAll('tint', color);
        this.largeplatforms.setAll('tint', color);

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
        platform.angle = platform.body.angle;
    }
}