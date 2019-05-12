class Player extends Phaser.Sprite
{
    // behavior values
    shardCount = 3;
    shardLaunchVelocity = 500;
    raycastRadius = 150;
    groundRaycastDistance = 60;
    groundRaycastWidth = 15;

    // references
    inputManager;
    stateManager;
    tileMapLayer;
    collisionGroup;
    tilemapCollisionGroup;
    shardCollisionGroup;
    raycastTargets;
    shards;

    // flags
    launched;
    onShard;

    constructor(game, tilemapLayer, tilemapCollisionGroup, x, y, key) 
    {
        
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

        this.raycastTargets = new Array();
        this.shards = new Array();
        
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

    fireShard()
    {
        var shard = new Shard(game, this.body.x, this.body.y, this, this.inputManager.getInputAsShardDirection());
        this.shards.add(shard);
        this.shardCount -= 1;
    }

    // returns whether the player should behave like they are on the ground
    onGround()
    {
        console.log("onGround");
        var position = new Vector(this.body.x, this.body.y);
        var direction = new Vector(0, this.groundRaycastDistance);
        var leftPosition = new Vector(this.body.x - this.groundRaycastWidth, this.body.y);
        var rightPosition = new Vector(this.body.x + this.groundRaycastWidth, this.body.y);
        // raycast down for floor tiles
        for(var index in this.raycastTargets)
        {
            var target = this.raycastTargets[index];
            
            //console.log(position.distance(target.x, target.y) < this.raycastRadius);
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

        if(shards.length == 0)
        {
            return false;
        }

        for(var shard in shards)
        {
            if(Raycast.raycastToRectangle(target, leftPosition, direction) != false)
            {
                return true;
            }
            if(Raycast.raycastToRectangle(target, rightPosition, direction) != false)
            {
                return true;
            }
        }
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
        console.log("Dead");
    }
}