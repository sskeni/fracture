class Player extends Phaser.Sprite
{
    // behavior values
    shardCount = 3;
    shardLaunchVelocity = 500;

    // references
    inputManager;
    stateManager;
    tileMapLayer;
    collisionGroup;
    tilemapCollisionGroup;
    shardCollisionGroup;

    // flags
    launched;
    onShard;

    constructor(game, tilemapLayer, tilemapCollisionGroup, x, y, key) {
        
        // properly inherit Phaser.Sprite
        super(game, x, y, key);
        game.add.world.add(this);

        
        // set anchor to be the center of the sprite
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        
        // set up input
        this.inputManager = new InputManager(game);
        
        // set up state manager
        this.stateManager = new PlayerStateManager(this);
        
        // save reference to tileMap layer (for raycasting tiles)
        this.tilemapLayer = tilemapLayer;
        this.tilemapCollisionGroup = tilemapCollisionGroup;
        
        // set up physics
        game.physics.p2.enable(this, true);
        //this.body.setRectangle(16, 30);
        this.body.setCircle(15);
        this.collisionGroup = game.physics.p2.createCollisionGroup();
        this.body.setCollisionGroup(this.collisionGroup);
        this.shardCollisionGroup = game.physics.p2.createCollisionGroup();
        this.body.collides(this.tilemapCollisionGroup);
        this.body.collides(this.shardCollisionGroup);
        this.body.tag = 'player';

        this.body.fixedRotation = true;

        this.launched = false;
        this.onShard = false;
    }

    update()
    {
        this.stateManager.update();
    }

    // restart the level after playing an animation // TODO: stub
    die()
    {
        console.log("Dead");
    }
}