"use strict";

var StandingDirection = {
    RIGHT: 0,
    LEFT: 1,
    DOWN: 2
}

// Behavior for when the player is on the ground and walking around.
class Ground extends PlayerState
{
    // behavior variables
    maxSpeed = 200;
    acceleration = 700;
    deceleration = 2000;
    stationaryDeceleration = 1000;
    velocityThreshold = 20;
    gravity = 1000;

    direction;


    constructor(stateManager) 
    {
        super(stateManager);
        this.direction = StandingDirection.DOWN;
    }

    // called every frame
    run() 
    {
        this.move();
        this.player.body.force.y = this.gravity;
    }

    // accelerate to move according to the player's input
    move()
    {
        // listen for horizontal input
        var horizontalInput = this.inputManager.getHorizontalInput();

        
        // if the player is trying to move
        if(Math.sign(this.player.body.velocity.x) == Math.sign(horizontalInput) || this.player.body.velocity.x == 0)
        {
            // a fast acceleration towards max speed
            if(Math.abs(this.player.body.velocity.x) > this.maxSpeed)// if we've reached max speed
            {
                this.player.body.velocity.x = this.maxSpeed * Math.sign(this.player.body.velocity.x);
            } 
            else
            {
                this.player.body.force.x = horizontalInput * this.acceleration;
            }
        }
        else
        {
            // a faster acceleration towards zero speed in order to help the player switch directions
            this.player.body.force.x = horizontalInput * this.deceleration;
        }

        if(horizontalInput == 0)// if the player wants to stop moving
        {
            if(Math.abs(this.player.body.velocity.x) < this.velocityThreshold)// if we've slowed down enough, stop altogether
            {
                this.player.body.velocity.x = 0;
            }
            else// otherwise slow down
            {
                this.player.body.force.x = -Math.sign(this.player.body.velocity.x) * this.stationaryDeceleration;
            }
        }
    }

    // called when a state is being transitioned away from
    deinitialize() {}

    // called when a state is being transitioned to
    initialize()
    {
        this.stoppedMoving = false;
        this.player.body.velocity.y = 0;
    }

    fireShard()
    {
        return true;
    }

}