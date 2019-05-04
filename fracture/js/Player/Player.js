class Player extends Phaser.Sprite
{
    // behavior values
    shardCount = 3;

    // references
    inputManager;
    stateManager;

    constructor(game, x, y, key) {
        
        // properly inherit Phaser.Sprite
        super(game, x, y, key);
        game.add.world.add(this);

        // set up input
        this.inputManager = new InputManager(game);

        // set up state manager
        this.stateManager = new PlayerStateManager(this);

        // set up physics
        game.physics.p2.enable(this);
        this.body.fixedRotation = true;
    }

    update()
    {
        this.stateManager.update();
    }
}