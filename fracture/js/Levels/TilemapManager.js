class TilemapManager
{
    tilemap;
    mapLayer;
    player;
    collisionGroup;

    BUTTONGID = 26;
    SPIKEGID = 27;
    ENDDOORGID = 28;
    STARTDOORGID = 29;
    CHECKPOINTGID = 30;
    DOORID = 31;

    constructor(player)
    {
        //save reference to player
        this.player = player;

        //create tileset and set collisions
        this.tilemap = game.add.tilemap('test');
        this.tilemap.addTilesetImage('testtileset', 'tilesheet');
        this.tilemap.setCollisionByExclusion([]);
        
        this.collisionGroup = game.physics.p2.createCollisionGroup();

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
        this.startdoors.forEach(this.configureStartDoor, this);
        this.enddoors.forEach(this.configureEndDoor, this);
        this.buttons.forEach(this.configureButton, this);
        this.spikes.forEach(this.configureSpike, this);
        this.checkpoints.forEach(this.configureCheckpoint, this);
        this.doors.forEach(this.configureDoor, this);

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

    update() {
        this.buttons.forEach(this.checkButton, this);
    }

    checkButton(button) {
        if(button.body.hit) {
            this.doors.forEach(this.openDoor, this);
        }
    }

    openDoor(door) {
        door.destroy();
    }

    configureStartDoor(door)
    {
    	door.body.x = door.x + door.width/2;
    	door.body.y = door.y + door.height/2;

    	door.body.kinematic = true;

    	this.calculateColor(door);
    	door.body.tag = 'start';
    }

    configureEndDoor(door)
    {
    	this.configureBody(door.body, door.width, door.height);
    	door.body.x = door.x + door.width/2;
    	door.body.y = door.y + door.height/2;

    	door.body.kinematic = true;

    	this.calculateColor(door);
    	door.body.tag = 'end';

    }

    configureButton(button)
    {
    	this.configureBody(button.body, button.width, button.height);
    	button.body.x = button.x + button.width/2;
    	button.body.y = button.y + button.height/2;

    	button.body.kinematic = true;

    	this.calculateColor(button);
    	button.body.tag = 'button';
        button.body.hit = false;
    }

    configureSpike(spike)
    {
    	this.configureBody(spike.body, spike.width, spike.height);
    	spike.body.x = spike.x + spike.width/2;
    	spike.body.y = spike.y + spike.height/2;

    	spike.body.kinematic = true;

    	this.calculateColor(spike);
    	spike.body.tag = 'spike';
    }

    configureCheckpoint(checkpoint)
    {
    	checkpoint.body.x = checkpoint.x + checkpoint.width/2;
    	checkpoint.body.y = checkpoint.y + checkpoint.height/2;

    	checkpoint.body.kinematic = true;

    	this.calculateColor(checkpoint);
    	checkpoint.body.tag = 'checkpoint';
    }

    configureDoor(door)
    {
        this.configureBody(door.body, door.width, door.height);
    	door.body.x = door.x + door.width/2;
    	door.body.y = door.y + door.height/2;

    	door.body.kinematic = true;

    	this.calculateColor(door);
    	door.body.tag = 'door';
    }

    configureBody(body, width, height)
    {
        body.setCollisionGroup(this.collisionGroup);
        body.collides(this.player.collisionGroup);
        body.collides(this.player.shardCollisionGroup);
        body.rectangle = Rectangle.createFromBody(body, width, height, body.tag);
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