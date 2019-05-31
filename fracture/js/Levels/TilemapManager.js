class TilemapManager
{
    tilemap;
    mapLayer;
    player;
    collisionGroup;
    tilemapArray;
    currentLevel;

    BUTTONGID = 31;
    SPIKEGID = 29;
    ENDDOORGID = 30;
    STARTDOORGID = 26;
    CHECKPOINTGID = 27;
    DOORID = 28;

    constructor(player, tilemap)
    {
        //save reference to player
        this.player = player;

        //set level stuff
        this.currentLevel = 0;
        this.tilemapArray = new Array();
        this.tilemapArray.push(tilemap);

        //set tilemap
        this.tilemap = game.add.tilemap(this.tilemapArray[this.currentLevel]);
        
        //set collisionGroup
        this.collisionGroup = game.physics.p2.createCollisionGroup();

        //setup tilemap
        this.setupTilemap();

        //create objects from tilemap
        this.createObjects();

        //create tiles from tilemap
        this.createTiles();

        //move player to start of level
        this.player.startLevel(this.startdoors.getTop().x + 16, this.startdoors.getTop().y + 16);      
    }

    addLevel(tilemap)
    {
        this.tilemapArray.push(tilemap);
    }

    nextLevel()
    {
        //reset objects
        this.resetObjects();

        //reset tilemap
        this.resetTilemap();

        this.currentLevel++;

        //set tilemap
        this.tilemap = game.add.tilemap(this.tilemapArray[this.currentLevel]);

        //reload tilemap
        this.setupTilemap();
        this.createObjects();
        this.createTiles();

        this.player.startLevel(this.startdoors.getTop().x + 16, this.startdoors.getTop().y + 16);
    }

    update() {
        //check if buttons are activated
        this.buttons.forEach(this.checkButton, this);

        //check if player has reached the end
        this.enddoors.forEach(this.checkEnd, this, true);

        //check if player has reached checkpoint
        this.checkpoints.forEach(this.checkCheckpoint, this, true);
    }

    setupTilemap()
    {
        this.tilemap.addTilesetImage('testtileset', 'tilesheet');
        this.tilemap.setCollisionByExclusion([]);
    }

    resetTilemap()
    {
        //remove p2 physics bits
        game.physics.p2.clearTilemapLayerBodies(this.tilemap, this.mapLayer);

        //remove mapLayer
        this.mapLayer.destroy();

        //remove tilemap
        this.tilemap.destroy();
    }

    createObjects()
    {
        //add start doors
        this.startdoors = game.add.group();
        this.startdoors.enableBody = true;
        this.startdoors.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('objects', this.STARTDOORGID, 'startdoor', 0, true, false, this.startdoors);

        //add end doors
        this.enddoors = game.add.group();
        this.enddoors.enableBody = true;
        this.enddoors.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('objects', this.ENDDOORGID, 'enddoor', 0, true, false, this.enddoors);

        //add buttons
        this.buttons = game.add.group();
        this.buttons.enableBody = true;
        this.buttons.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('objects', this.BUTTONGID, 'button', 0, true, false, this.buttons);

        //add spikes
        this.spikes = game.add.group();
        this.spikes.enableBody = true;
        this.spikes.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('objects', this.SPIKEGID, 'spike', 0, true, false, this.spikes);

        //add checkpoints
        this.checkpoints = game.add.group();
        this.checkpoints.enableBody = true;
        this.checkpoints.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('objects', this.CHECKPOINTGID, 'checkpoint', 0, true, false, this.checkpoints);

        //add doors
        this.doors = game.add.group();
        this.doors.enableBody = true;
        this.doors.physicsBodyType = Phaser.Physics.P2JS;
        this.tilemap.createFromObjects('objects', this.DOORID, 'door', 0, true, false, this.doors);

        //move objects to account for anchor and configure bodies for raycasting
        this.startdoors.forEach(this.configureNonCollidableBody, this, true, 'start');
        this.enddoors.forEach(this.configureNonCollidableBody, this, true, 'end');
        this.buttons.forEach(this.configureCollidableBody, this, true, 'button');
        this.spikes.forEach(this.configureCollidableBody, this, true, 'spike');
        this.checkpoints.forEach(this.configureNonCollidableBody, this, true, 'checkpoint');
        this.doors.forEach(this.configureCollidableBody, this, true, 'door');
    }

    resetObjects()
    {
        //remove rectangles for collidable bodies
        this.buttons.forEach(this.deleteBody, this, true);
        this.spikes.forEach(this.deleteBody, this, true);
        this.doors.forEach(this.deleteBody, this, true);

        this.startdoors.destroy();
        this.enddoors.destroy();
        this.buttons.destroy();
        this.spikes.destroy();
        this.checkpoints.destroy();
        this.doors.destroy();
    }

    createTiles()
    {
        //add tilset to map layer
        this.mapLayer = this.tilemap.createLayer('walls');
        this.mapLayer.resizeWorld();

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

    checkButton(button) {
        //check if any button is hit
        if(button.body.hit)
        {
            //destroy the door
            this.doors.forEach(this.openDoor, this);
        }
    }

    configureCollidableBody(object, tag)
    {
        this.configureBody(object.body, object.width, object.height);
        object.body.x = object.x + object.width/2;
        object.body.y = object.y + object.height/2;

        object.body.kinematic = true;

        this.calculateColor(object);
        object.body.tag = tag;
    }

    configureNonCollidableBody(object, tag)
    {
        object.body.x = object.x + object.width/2;
        object.body.y = object.y + object.height/2;

        object.body.kinematic = true;

        this.calculateColor(object);
        object.body.tag = tag;
    }

    configureBody(body, width, height)
    {
        body.setCollisionGroup(this.collisionGroup);
        body.collides(this.player.collisionGroup);
        body.collides(this.player.shardCollisionGroup);
        body.rectangle = Rectangle.createFromBody(body, width, height, body.tag);
        this.player.addRaycastTarget(body);
    }

    deleteBody(object)
    {
        this.player.removeRaycastTarget(object.body);
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

    openDoor(door) {
        door.destroy();
    }

    checkEnd(door)
    {
        var playerBounds = this.player.getBounds();
        var doorBounds = door.getBounds();

        if(Phaser.Rectangle.intersects(playerBounds, doorBounds))
        {
            console.log('next level');
            this.nextLevel();
        }
    }

    checkCheckpoint(checkpoint)
    {
        var playerBounds = this.player.getBounds();
        var checkpointBounds = checkpoint.getBounds();

        if(Phaser.Rectangle.intersects(playerBounds, checkpointBounds))
        {
            console.log('checkpoint reached');
        }
    }
}