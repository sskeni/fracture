class Player extends Phaser.Sprite
{
    // behavior values
    shardCount = 3;// the number of shards the player can fire
    shardLaunchVelocity = 500;// the velocity at which the player is launched when a shard grows right next to them
    raycastRadius = 150;// the radius under which tiles are raycasted. Ensures that tiles we're guaranteed not to hit are not tested 
    groundRaycastDistance = 18;// the distance to raycast for ground tiles
    groundRaycastWidth = 10;// the horizontal offset to the left and right that raycasts for ground should be made at

    // references
    inputManager;
    stateManager;
    collisionGroup;
    tilemapCollisionGroup;
    shardCollisionGroup;
    raycastTargets;
    shards;
    animationController;
    audioManager;

    // flags
    launched;
    standingOnShard;

    constructor(game, x, y, key) 
    {
        // properly inherit Phaser.Sprite
        super(game, x, y, 'player');
        game.add.world.add(this);

        var color = Math.random() * 0xffffff;
        this.tint = color;

        
        // set anchor to be the center of the sprite
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        
        // set up input
        this.inputManager = new InputManager(game);
        
        // set up state manager
        this.stateManager = new PlayerStateManager(this);

        this.raycastTargets = new Array();
        this.shards = new Array();

        // set up animation controller
        this.animationController = new PlayerAnimationController(this);

        // set up audio manager
        this.audioManager = new PlayerAudioManager(this);

        // set up physics
        game.physics.p2.enable(this, false);
        this.body.setCircle(15);
        this.collisionGroup = game.physics.p2.createCollisionGroup();
        this.body.setCollisionGroup(this.collisionGroup);
        this.shardCollisionGroup = game.physics.p2.createCollisionGroup();
        this.body.collides(this.shardCollisionGroup);
        this.body.tag = 'player';

        this.body.fixedRotation = true;

        // set flags
        this.launched = false;
        this.standingOnShard = false;
    }

    // loads all assets used by the player
    static load()
    {
        PlayerAnimationController.load();
        PlayerAudioManager.load();
    }

    update()
    {
        this.stateManager.update();
        this.inputManager.update();
    }

    setTilemapCollisionGroup(tilemapCollisionGroup)
    {
        this.tilemapCollisionGroup = tilemapCollisionGroup;
        this.body.collides(this.tilemapCollisionGroup);
    }

    fireShard(direction)
    {
        if(this.shardCount > 0)
        {
            var shard = new Shard(game, this.body.x, this.body.y, this, direction);
            this.shards.push(shard);
            this.shardCount -= 1;

            // play firing sound
            this.audioManager.playFireShard();

            // shake the camera
            GamefeelMaster.shakeCamera(0.00002, 0, 100, 0.000001, 100, 100);
        }
    }

    // returns whether the player should behave like they are on the ground
    onGround()
    {
        var position = new Vector(this.body.x, this.body.y);
        var direction = new Vector(0, this.groundRaycastDistance);
        var leftPosition = new Vector(this.body.x - this.groundRaycastWidth, this.body.y);
        var rightPosition = new Vector(this.body.x + this.groundRaycastWidth, this.body.y);
        // raycast down for floor tiles
        for(var index in this.raycastTargets)
        {
            var target = this.raycastTargets[index];

            if(target.y > this.y && position.distance(new Vector(target.x, target.y)) < this.raycastRadius)
            {
                if(Raycast.raycastToRectangle(target.rectangle, leftPosition, direction) != false)
                {
                    return true;
                }
                if(Raycast.raycastToRectangle(target.rectangle, rightPosition, direction) != false)
                {
                    return true;
                }
            }
        }
        return false;
    }

    // returns whether the player should behave like they are on a shard
    onShard()
    {
        var position = new Vector(this.body.x, this.body.y);
        var direction = new Vector(0, this.groundRaycastDistance);
        var leftPosition = new Vector(this.body.x - this.groundRaycastWidth, this.body.y);
        var rightPosition = new Vector(this.body.x + this.groundRaycastWidth, this.body.y);

        if(this.shards.length == 0)
        {
            return false;
        }

        for(var shard of this.shards)
        {
            if(shard.planted == true)
            {
                if(!(shard.direction == ShardDirection.UM || shard.direction == ShardDirection.BM))// if the shard isn't vertical
                {
                    direction = new Vector(0, this.groundRaycastDistance - 5);// don't raycast as far
                }

                if(Raycast.raycastToRectangle(shard.rectangle, position, direction) != false)
                {
                    return shard;
                }
                if(Raycast.raycastToRectangle(shard.rectangle, leftPosition, direction) != false)
                {
                    return shard;
                }
                if(Raycast.raycastToRectangle(shard.rectangle, rightPosition, direction) != false)
                {
                    return shard;
                }
            }
        }

        return false;
    }


    addRaycastTarget(target)
    {
        if('rectangle' in target)
        {
            this.raycastTargets.push(target);
        }
        else
        {
            console.error("Error - object cannot be added to raycastTargets because it does not have a rectangle property");
        }
    }

    // restart the level after playing an animation // TODO: stub
    die()
    {
        this.audioManager.playSound('shatter', 0.3);
        console.log("Dead");
    }
}