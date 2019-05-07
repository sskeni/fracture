"use strict";

var StandingDirection = {
    RIGHT: 45,
    LEFT: -45,
    DOWN: 2
}

// Behavior for when the player is on the ground and walking around.
class Ground extends PlayerState
{
    // behavior variables
    maxSpeed = 200;// maximum movement velocity
    acceleration = 700;// force to apply when accelerating to max speed
    deceleration = 2000;// force to apply when input is counter to the current velocity
    stationaryDeceleration = 1000;// force to apply against motion when player is giving no input
    velocityThreshold = 20;// the speed under which the player's velocity should be set directly to zero
    gravity = 1000;// the force of gravity on the player

    standingDirection;


    constructor(stateManager) 
    {
        super(stateManager);
        this.standingDirection = StandingDirection.DOWN;
    }

    // called every frame
    run() 
    {
        if(this.standingDirection == StandingDirection.DOWN)
        {
            this.move();
            this.player.body.force.y = this.gravity;
        }
        else
        {
            this.moveSlanted(this.standingDirection);
        }
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
            if(!this.player.launched)
            {
                this.player.body.force.x = horizontalInput * this.deceleration;
            }
        }

        if(horizontalInput == 0 && !this.player.launched)// if the player wants to stop moving
        {
            if(Math.abs(this.player.body.velocity.x) < this.velocityThreshold + 20)// if we've slowed down enough, stop altogether
            {
                this.player.body.velocity.x = 0;
            }
            else// otherwise slow down
            {
                this.player.body.force.x = -Math.sign(this.player.body.velocity.x) * this.stationaryDeceleration;
            }
        }
    }

    moveSlanted(standingDirection)
    {
        var velocityVector = new Vector(this.player.body.velocity.x, this.player.body.velocity.y);
        var inputVector = Vector.createVectorFromAngle(standingDirection);
        
        //remove all velocity normal to the surface
        var normalVelocity = velocityVector.sum(velocityVector.projectOnto(inputVector).multiply(-1));
        this.player.body.velocity.x -= normalVelocity.x/50;
        this.player.body.velocity.y -= normalVelocity.y/50;
        
        inputVector.setMagnitude(this.inputManager.getHorizontalInput());
        if(velocityVector.sameDirection(inputVector) || velocityVector.magnitude() == 0)
        {
            // a fast acceleration towards max speed
            if(velocityVector.magnitude() > this.maxSpeed)// if we've reached max speed
            {
                velocityVector.setMagnitude(this.maxSpeed);
                this.player.body.velocity.x = velocityVector.x;
                this.player.body.velocity.y = velocityVector.y;
            } 
            else
            {
                this.player.body.force.x = inputVector.x * this.acceleration;
                this.player.body.force.y = inputVector.y * this.acceleration;
            }
        }
        else
        {
            // a faster acceleration towards zero speed in order to help the player switch directions
            if(!this.player.launched)
            {
                this.player.body.force.x = inputVector.x * this.deceleration;
                this.player.body.force.y = inputVector.y * this.deceleration;
            }
        }
        if(inputVector.magnitude() == 0 && !this.player.launched)// if the player wants to stop moving
        {
            if(Math.abs(this.player.body.velocity.x) < this.velocityThreshold)// if we've slowed down enough, stop altogether
            {
                this.player.body.velocity.x = 0;
            }
            else// otherwise slow down
            {
                velocityVector.setMagnitude(1);
                this.player.body.force.x = velocityVector.x * -this.stationaryDeceleration;
                this.player.body.force.y = velocityVector.y * -this.stationaryDeceleration;
            }
        }
    }

    // called when a state is being transitioned away from
    deinitialize() {}

    // called when a state is being transitioned to
    initialize()
    {
        this.player.body.velocity.y = 0;
    }

    fireShard()
    {
        return true;
    }

}