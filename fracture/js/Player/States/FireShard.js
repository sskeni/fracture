"use strict";

// Behavior for when the player is firing a shard.
class FireShard extends PlayerState
{
    // loading variables
    cursorBaseKey = 'cursorBase';
    cursorTipKey = 'cursorTip';

    // behavior variables
    duration = 2000;// The amount of time in ms that the state will wait before automatically firing the shard
    cursorOffset = 32;// the offset of the base cursor's position from the center of the player
    //cursorTipOffset = 0;// the offset of the cursor tip from the base cursor
    cursorTipMoveDistance = 10;// determines how far the cursor tip will move in the time it takes for the state to finish
    slowMotionFactor = 4;// The ratio of real time to game time while in this state(2.0 = half speed)

    // runtime variables
    previousInputAngle;// the last direction we received non-zero input in

    // timers
    startTime;// the time this state was initialized at
    endTime;// the time when this state should end

    // references
    cursorBase;// the Phaser image for one half of the player's cursor
    cursorTip;// the Phaser image for the other half of the player's cursor

    constructor(stateManager) 
    {
        super(stateManager);

        this.createCursor();
        this.previousInputAngle = 0;
    }

    // called every frame
    run() 
    {
        // update position of cursor
        this.updateCursor();
        
        // if the button is released OR we run out of time
        if(!this.inputManager.shardButtonIsDown() || game.time.now > this.endTime)
        {
            // spawn the shard

            // use the current input if it is not zero
            if(this.inputManager.getHorizontalInput() != 0 || this.inputManager.getVerticalInput() != 0)
            {
                this.player.fireShard(this.inputManager.getInputAsShardDirection());
            }
            else// otherwise use the last valid input
            {                
                this.player.fireShard(this.previousInputAngle);
            }

            // transition to wherever we came from
            this.stateManager.transitionToState(this.stateManager.previousState);
        }
    }

    initialize()
    {
        // record the time 
        this.startTime = game.time.now;
        this.endTime = game.time.now + this.duration;

        // set up cursor
        this.cursorBase.visible = true;
        this.cursorTip.visible = true;
        this.updateCursor();

        // slow down time
        game.time.slowMotion = this.slowMotionFactor;

    }

    deinitialize()
    {
        // make cursor invisable
        this.cursorBase.visible = false;
        this.cursorTip.visible = false;

        // return time to normal
        game.time.slowMotion = 1;
    }

    transitionConditionsMet() 
    {
        return this.inputManager.shardButtonJustDown() && this.player.shardCount > 0;
    }

    // creates the image that will be used to show the player which direction their input is in
    createCursor()
    {
        this.cursorBase = game.add.image(0, 0, this.cursorBaseKey);
        this.cursorTip = game.add.image(0, 0, this.cursorTipKey);

        this.cursorBase.visible = false;
        this.cursorTip.visible = false;

        this.cursorBase.anchor.set(0.5);
        this.cursorTip.anchor.set(0.5);
    }

    // updates the cursor to reflect the player's current input
    updateCursor()
    {
        var position;
        var angle = this.inputManager.getInputAsShardDirection() - 90;
        // if the player 
        if(this.inputManager.getHorizontalInput() != 0 || this.inputManager.getVerticalInput() != 0)// if we're getting input, the value of angle is good
        {
            // the angle of the cursor is in the direction of player input
            var angle = this.inputManager.getInputAsShardDirection();
    
            // the position is the player's position plus an offset in the direction of player input
            var position = new Vector(this.player.body.x, this.player.body.y);
            position = position.sum(Vector.createVectorFromAngle(angle).multiply(this.cursorOffset));

            this.previousInputAngle = angle;
        }
        else// otherwise we should use the previous value for angle
        {
            var position = new Vector(this.player.body.x, this.player.body.y);
            position = position.sum(Vector.createVectorFromAngle(this.previousInputAngle).multiply(this.cursorOffset));
        }

        this.cursorBase.x = position.x;
        this.cursorBase.y = position.y;
        this.cursorBase.angle = angle;
        
        // the tip is offset a little further, based on how long it's been since the start of the state
        var tipOffset = ((game.time.now - this.startTime)/this.duration) * this.cursorTipMoveDistance;
        position = position.setMagnitude(this.cursorOffset + tipOffset);

        this.cursorTip.x = position.x;
        this.cursorTip.y = position.y;
        this.cursorTip.angle = angle;
    }

}