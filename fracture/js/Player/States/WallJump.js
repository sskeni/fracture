"use strict";

// this enum doubles as the angle at which the player should jump off the wall
var WallDirection = {
    RIGHT: 225,
    LEFT: -45
}

// Behavior for when the player is firing a shard.
class WallJump extends PlayerState
{
    // behavior variables
    fallSpeed = 100;// the maximum speed at which the player can fall
    fallAcceleration = 100;// the acceleration at which the player will approach their maximum fall speed
    riseDeceleration = 1000;// the strength of deceleration when the player is moving up
    jumpStrength = 300;// the magnitude of the initial velocity the player gains when jumping from the wall
    raycastDistance = 17;// the distance under which a wall is close enough to walljump from
    cooldown = 300;// the length of time that must be waited before this state can be transitioned to again
    exitWallHoldTime = 0.1;// the length of time the player must hold away from the wall to exit the wall

    // runtime variables
    direction;// the direction towards the shard we are attached to
    directionalInputHeld;
    
    // timers
    timeOfLastDeinitialization;// The time when this state was last transitioned away from
    timeOfExitDirectionDown;

    // references
    jumpState;// the player's jump state

    constructor(stateManager) 
    {
        super(stateManager);
        this.timeOfLastDeinitialization = game.time.now - this.cooldown;
        this.timeOfExitDirectionDown = 0;
        this.directionalInputHeld = false;
    }

    // called every frame
    run()
    {
        // slide down slowly
        if(this.player.body.velocity.y < 0)
        {
            this.player.body.force.y = this.riseDeceleration;
        }
        else if(this.player.body.velocity.y < this.fallSpeed)
        {
            this.player.body.force.y = this.fallAcceleration;
        }
        else
        {
            this.player.body.velocity.y = this.fallSpeed;
        }

        // jump off the wall if the player asks to
        if(this.inputManager.jumpButtonJustDown())
        {
            // gain momentum based on direction of wall and transition to jump
            var initialVelocity = Vector.createVectorFromAngle(this.direction).setMagnitude(this.jumpStrength);

            this.player.body.velocity.x = initialVelocity.x;
            this.player.body.velocity.y = initialVelocity.y;

            this.jumpState.initializeFalling = true;
            this.stateManager.transitionToState(this.jumpState);
        }

        // if the player slides off of the wall
        if(this.exitWallConditionsMet())
        {
            // start falling
            this.jumpState.initializeFalling = true;
            this.stateManager.transitionToState(this.jumpState);
        }
    }

    exitWallConditionsMet()
    {
        if(!this.onWall(Vector.createVectorFromAngle((this.direction == WallDirection.RIGHT ? 0 : 180))))
        {
            return true;
        }

        var horizontalInput = this.inputManager.getHorizontalInput();
        if(this.direction == WallDirection.LEFT && horizontalInput > 0)
        {
            if(!this.directionalInputHeld)
            {
                this.timeOfExitDirectionDown = game.time.now;
                this.directionalInputHeld = true;
            }
        }
        else if(this.direction == WallDirection.RIGHT && horizontalInput < 0)
        {
            if(!this.directionalInputHeld)
            {
                this.timeOfExitDirectionDown = game.time.now;
                this.directionalInputHeld = true;
            }
        }
        else
        {
            this.directionalInputHeld = false;
        }
        return game.time.now > this.timeOfExitDirectionDown + this.exitWallHoldTime * Phaser.Timer.SECOND && this.directionalInputHeld;
    }

    // returns whether there is a wall in the given direction
    // direction is a vector representing which direction to raycast in
    onWall(direction)
    {
        for(let shard of this.player.shards)
        {
            if(shard.planted)
            {
                var position = new Vector(this.player.body.x, this.player.body.y);
                // if there is a shard close enough to our right
                if(Raycast.raycastToRectangle(shard.rectangle, position, direction.setMagnitude(this.raycastDistance)) != false)
                {
                    // TODO: decide whether the player should be able to wall jump on horizontal shards
                    // if the shard is straight up and down, we are on the wall
                    if(shard.direction == ShardDirection.UM || shard.direction == ShardDirection.BM)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    initialize()
    {
        this.player.body.velocity.x = 0;
        this.directionalInputHeld = false;
    }
    
    deinitialize()
    {
        this.timeOfLastDeinitialization = game.time.now;
    }

    transitionConditionsMet()
    {
        if(game.time.now > this.timeOfLastDeinitialization + this.cooldown)
        {
            // if there is a shard to the right
            if(this.onWall(Vector.createVectorFromAngle(0)))
            {
                this.direction = WallDirection.RIGHT;
                return true;
            }
            else if(this.onWall(Vector.createVectorFromAngle(180)))// if there is a shard to the left
            {
                this.direction = WallDirection.LEFT;
                return true;
            }
        }

        return false;
    }

}