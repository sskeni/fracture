"use strict";

// Behavior for when the player is jumping or falling through the air
class Jump extends PlayerState
{
    /*
    // behavior variables
    initialVelocity = 300;
    upGravity = 1100;// The gravity to apply while the player is going up
    upHoldGravity = 500;// The gravity to apply while the player is going up and the jump button is held
    downGravity = 1300;// The gravity to apply while the player is falling
    maxVelocity = 200;// the maximum velocity the player can fall at
    fallDamageHeight = 30;// the height the player can fall before taking fall damage (will be multiplied by the current number of shards)
    
    // references
    ground;// the player's ground state
    
    // flags
    buttonReleased;// whether the jump button has been released
    landed;// whether the player should transition to the ground state on the next update
    initializeFalling;// whether the player fell off of a ledge to initialize the falling state
    onShard;// whether the player is standing on a shard currently
    anticipatedShatter;// whether we've already anticipated the player shattering with hitstop

    // runtime variables
    maxHeight;// the lowest y value (greatest height) the player has had while jumping
    */
   
    constructor(stateManager) 
    {
        super(stateManager);

        this.initialVelocity = 300;
        this.upGravity = 1100;// The gravity to apply while the player is going up
        this.upHoldGravity = 500;// The gravity to apply while the player is going up and the jump button is held
        this.downGravity = 1300;// The gravity to apply while the player is falling
        this.maxVelocity = 200;// the maximum velocity the player can fall at
        this.fallDamageHeight = 30;// the height the player can fall before taking fall damage (will be multiplied by the current number of shards)
    }

    // called every frame
    run() 
    {
        // hold to jump higher (reduced gravity while holding)
        // experience gravity
        // floats at top
        // falls quickly
        if(this.player.body.velocity.y < -0.01)// if we are going up
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
                this.player.body.velocity.y = -this.maxVelocity;
            }
            else
            {
                this.player.body.force.y = this.downGravity;
            }
            if(this.player.onGround())
            {
                this.ground.standingDirection = StandingDirection.DOWN;
                this.landed = true;
            }
            var shard = this.player.onShard();
            if(shard != false)
            {
                if(shard.direction == ShardDirection.BR || shard.direction == ShardDirection.UL)
                {
                    this.ground.standingDirection = StandingDirection.RIGHT;
                }
                else if(shard.direction == ShardDirection.BL || shard.direction == ShardDirection.UR)
                {
                    this.ground.standingDirection = StandingDirection.LEFT;
                }
                this.player.standingOnShard = true;
                this.landed = true;
            }
        }

        // update how high our max height was
        if(this.player.body.y < this.maxHeight)
        {
            this.maxHeight = this.player.body.y;
        }

        // play the correct animations
        this.player.animationController.animateJump();

        // if I'm about do die, warn the player
        if(this.fallenTooFar() && !this.anticipatedShatter)
        {
            GamefeelMaster.hitStop(0.2);
            this.player.animationController.flashScreen(0.2);
            this.anticipatedShatter = true;
        }

        // allow the player horizontal control
        this.ground.move();

        this.player.audioManager.updateJump();

        if(this.landed)//this.landed
        {
            // check to see if we've fallen too far
            if(this.fallenTooFar())
            {
                this.player.die();
            }
            if(this.stateManager.currentState == this)
            {
                this.player.audioManager.playSound('land', 0.3);
                this.stateManager.transitionToState(this.ground);
            }
        }
    }

    // returns whether the player should shatter if they land on the ground from the current height
    fallenTooFar()
    {
        return this.player.body.y - this.maxHeight > this.calculateMaxFallHeight() && !this.player.standingOnShard && !this.player.justReset;
    }

    // returns how far the player can fall before shattering
    calculateMaxFallHeight()
    {
        return this.fallDamageHeight * (this.player.shardCount + 1);
    }

    // called when a state is being transitioned away from
    deinitialize()
    {
        this.player.audioManager.deinitializeJump();
    }

    // called when a state is being transitioned to
    initialize() 
    {
        this.player.standingOnShard = false;

        if(!this.initializeFalling)// if we pressed the jump button to begin this jump
        {
            // gain initial vertical momentum
            this.player.audioManager.playSound('jump', 0.3);
            this.player.body.velocity.y = -this.initialVelocity;
            this.player.body.force.y = this.upHoldGravity;
        }


        this.player.audioManager.initializeJump();

        // initialize flags
        this.buttonReleased = false;
        this.landed = false;
        this.anticipatedShatter = false;
        this.maxHeight = 10000;
    }

    // called when this state appears as an adjacent state for another state
    transitionConditionsMet() 
    {
        if(!this.player.onGround() && !this.player.onShard())// if I'm not on the ground or on a shard, I should enter free fall
        {
            this.initializeFalling = true;
            return true;
        }
        else
        {
            this.initializeFalling = false;
        }

        return this.inputManager.jumpButtonJustDown();
    }
}