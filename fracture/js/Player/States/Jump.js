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

    // references
    ground;

    // flags
    buttonReleased;
    landed;
    
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

        this.ground.move();

        if(this.landed)
        {
            console.log("hello");
            this.stateManager.transitionToState(this.ground);
        }
    }

    // called when a state is being transitioned away from
    deinitialize() 
    {

    }

    // called when a state is being transitioned to
    initialize() 
    {
        // gain initial vertical momentum
        this.player.body.velocity.y = -this.initialVelocity;
        this.player.body.force.y = this.upHoldGravity;
        this.buttonReleased = false;
        this.landed = false;

        this.player.body.onBeginContact.addOnce(this.onBeginContact, this);
    }

    /**
    * From the Phaser documentation
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
    onBeginContact(abstractContactedBody, contactedBody, myShape, theirShape, contactEquation)
    {
        this.landed = true;
    }

    // called when this state appears as an adjacent state for another state
    transitionConditionsMet() 
    {
        return this.inputManager.jumpButtonIsDown();
    }

    fireShard()
    {
        // gain impulse based on shard fire direction
        return true;
    }


}