"use strict";

// Behavior for when the player is jumping or falling through the air
class Jump extends PlayerState
{
    // behavior variables
    initialVelocity = 300;
    upGravity = 1100;// The gravity to apply while the player is going up
    upHoldGravity = 500;// The gravity to apply while the player is going up and the jump button is held
    downGravity = 1300;// The gravity to apply while the player is falling
    maxVelocity = 200;// the maximum velocity the player can fall at
    fallDamageHeight = 30;// the height the player can fall before taking fall damage (will be multiplied by the current number of shards)
    groundRaycastDistance = 20;// the distance to raycast for checking if we've hit the ground or not
    groundRaycastWidth = 15;
    
    // references
    ground;// the player's ground state
    
    // flags
    buttonReleased;// whether the jump button has been released
    landed;// whether the player should transition to the ground state on the next update
    initializeFalling;// whether the player fell off of a ledge to initialize the falling state
    onShard;// whether the player is standing on a shard currently

    // runtime variables
    maxHeight;// the lowest y value (greatest height) the player has had while jumping
    
    constructor(stateManager) 
    {
        super(stateManager);
    }

    // called every frame
    run() 
    {
        // hold to jump higher (reduced gravity while holding)
        // experience gravity
        // floats at top
        // falls quickly
        if(this.player.body.velocity.y < 0)// if we are going up
        {
            if(this.inputManager.jumpButtonIsDown() && !this.buttonReleased)
            {
                this.player.body.force.y = this.upHoldGravity;
            }
            else
            {
                this.buttonReleased = true;
                this.player.body.force.y = this.upGravity;
            }
        }
        else// if we are going down
        {          
            if(this.player.body.velocity.y < -this.maxVelocity)
            {
                this.player.body.force.y = -this.maxVelocity;
            }
            else
            {
                this.player.body.force.y = this.downGravity;
            }
        }

        // update how high our max height was
        if(this.player.body.y < this.maxHeight)
        {
            this.maxHeight = this.player.body.y;
        }

        this.ground.move();

        if(this.landed)
        {
            // check to see if we've fallen too far
            if(this.player.body.y - this.maxHeight > this.fallDamageHeight * this.player.shardCount && !this.player.onShard)
            {
                this.player.die();
            }
            this.stateManager.transitionToState(this.ground);
        }

        //TODO if launched by shard, allow double jump
    }

    // called when a state is being transitioned away from
    deinitialize()
    {

    }

    // called when a state is being transitioned to
    initialize() 
    {
        if(!this.initializeFalling)// if we pressed the jump button to begin this jump
        {
            // gain initial vertical momentum
            this.player.body.velocity.y = -this.initialVelocity;
            this.player.body.force.y = this.upHoldGravity;
        }

        // initialize flags
        this.buttonReleased = false;
        this.landed = false;
        this.maxHeight = 10000;

        // make sure that we're subscribing to the player's collision event to check if we've hit the ground
        if(!this.player.body.onBeginContact.has(this.onBeginContact, this))
        {
            this.player.body.onBeginContact.add(this.onBeginContact, this);
        }
        if(!this.player.body.onEndContact.has(this.onEndContact, this))
        {
            this.player.body.onEndContact.add(this.onEndContact, this);
        }
    }

    /**
    * From the Phaser documentation:
    * Dispatched when a first contact is created between shapes in two bodies.
    * This event is fired during the step, so collision has already taken place.
    *
    * The event will be sent 5 arguments in this order:
    *
    * The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
    * The p2.Body this Body is in contact with.
    * The Shape from this body that caused the contact.
    * The Shape from the contact body.
    * The Contact Equation data array.
    */
    // 
    onBeginContact(abstractContactedBody, contactedBody, myShape, theirShape, contactEquation)
    {
        if(abstractContactedBody.tag == 'shard' && !this.player.onShard)
        {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            var shard = abstractContactedBody.shard;
            if(shard.direction == ShardDirection.UR || shard.direction == ShardDirection.BL)
            {
                this.ground.standingDirection = StandingDirection.RIGHT;
                this.landed = true;
            }
            else if(shard.direction == ShardDirection.UL || shard.direction == ShardDirection.BR)
            {
                this.ground.standingDirection = StandingDirection.LEFT;
                this.landed = true;
            }

            this.player.onShard = true;
            this.landed = true;
        }

        if(this.onGround())
        {
            this.ground.standingDirection = StandingDirection.DOWN;
            this.landed = true;
        }
    }

    onEndContact(body, bodyB, shapeA, shapeB, equation)
    {
        if(body.tag == 'shard')
        {   
            //game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {this.player.onShard = false;}, this)
            this.player.onShard = false;
        }
    }

    // returns whether there's ground under the player or not
    onGround()
    {
        //adjust these raycasts so they can have diagonal directions (for checking against shards)

        // raycast from the player's origin towards the ground
        var targetX = this.player.body.x - this.groundRaycastWidth;
        var targetY = this.player.body.y + this.groundRaycastDistance;
        var line = new Phaser.Line(this.player.body.x, this.player.body.y, targetX, targetY);
        var raycastTileList = this.player.tilemapLayer.getRayCastTiles(line, this.player.tilemapLayer.rayStepRate, true);

        if(raycastTileList.length > 0)// if we hit at least one tile
        {
            return true;
        }

        targetX = this.player.body.x + this.groundRaycastWidth;
        line = new Phaser.Line(this.player.body.x, this.player.body.y, targetX, targetY);
        raycastTileList = this.player.tilemapLayer.getRayCastTiles(line, this.player.tilemapLayer.rayStepRate, true);

        if(raycastTileList.length > 0)
        {
            return true;
        }

        return false;
    }

    // called when this state appears as an adjacent state for another state
    transitionConditionsMet() 
    {
        if(!this.onGround() && !this.player.onShard)
        {
            this.initializeFalling = true;
            return true;
        }
        else
        {
            this.initializeFalling = false;
        }

        return this.inputManager.jumpButtonIsDown();
    }

    fireShard()
    {
        // gain impulse based on shard fire direction
        return true;
    }


}