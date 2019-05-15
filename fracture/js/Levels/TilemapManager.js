class TilemapManager
{
    tilemap;
    mapLayer;
    player;
    collisionGroup;

    constructor(player)
    {
        //save reference to player
        this.player = player;

        //create tileset and set collisions
        this.tilemap = game.add.tilemap('test');
        this.tilemap.addTilesetImage('testtileset', 'tilesheet');
        this.tilemap.setCollisionByExclusion([]);

        //add tilset to map layer
        this.mapLayer = this.tilemap.createLayer('walls');
        this.mapLayer.resizeWorld();
        
        this.collisionGroup = game.physics.p2.createCollisionGroup();
        
        //add small platforms
        this.smallplatforms = game.add.group();
        this.smallplatforms.enableBody = true;
        this.smallplatforms.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('smallplatforms', 5, 'smallplatform', 0, true, false, this.smallplatforms);
        
        //add medium platforms
        this.mediumplatforms = game.add.group();
        this.mediumplatforms.enableBody = true;
        this.mediumplatforms.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('mediumplatforms', 6, 'mediumplatform', 0, true, false, this.mediumplatforms);
        
        //add large platforms
        this.largeplatforms = game.add.group();
        this.largeplatforms.enableBody = true;
        this.largeplatforms.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('largeplatforms', 7, 'largeplatform', 0, true, false, this.largeplatforms);

        //move platforms to account for anchor
        this.smallplatforms.forEach(this.configurePlatform, this);
        this.mediumplatforms.forEach(this.configurePlatform, this);
        this.largeplatforms.forEach(this.configurePlatform, this);
        
        //add p2 physics to tilemap
        this.tilemap.setCollisionByExclusion([]);
        game.physics.p2.convertTilemap(this.tilemap, this.mapLayer);
        
        this.player.setTilemapCollisionGroup(this.collisionGroup);
        
        this.tilemapBodies = game.physics.p2.convertTilemap(this.tilemap, this.mapLayer, true, false);
        
        for(let body of this.tilemapBodies)
        {
            this.configureBody(body, 16, 16);
        }
    }

    configurePlatform(platform)
    {
        this.configureBody(platform.body, platform.width, platform.height);
        platform.body.x = platform.x+platform.width/2;
        platform.body.y = platform.y+platform.height/2;
        platform.angle = platform.body.angle;

        platform.body.kinematic = true;

        this.calculateColor(platform);
        platform.body.tag = 'platform';
    }

    configureBody(body, width, height)
    {
        body.setCollisionGroup(this.collisionGroup);
        body.collides(this.player.collisionGroup);
        body.collides(this.player.shardCollisionGroup);
        body.rectangle = Rectangle.createFromBody(body, width, height);
        this.player.addRaycastTarget(body);
    }

    calculateColor(sprite)
    {
        /*//set colors for map
        color = Math.random() * 0xffffff;
        this.mapLayer.tint = color;
        this.smallplatforms.setAll('tint', color);
        this.mediumplatforms.setAll('tint', color);
        this.largeplatforms.setAll('tint', color);*/
    }
}