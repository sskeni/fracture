"use strict";

// all player behavior code should inherit and follow this form
class PlayerState 
{
    // references
    player;// the player this state is connected to
    stateManager;// the player's state manager
    inputManager;// the player's input manager

    adjacentStates;// a list of states which should check conditions for transition from this one

    
    constructor(stateManager) 
    {
        this.stateManager = stateManager;
        this.inputManager = this.stateManager.inputManager;
        this.player = this.stateManager.player;
        this.adjacentStates = [];
    }

    // called every frame
    run() {}

    // called when a state is being transitioned away from
    deinitialize() {}

    // called when a state is being transitioned to
    initialize() {}

    // called when this state appears as an adjacent state for another state
    transitionConditionsMet() 
    {
        return false;
    }

    // called when the player tries to fire a shard
    // returns whether or not a shard should be created
    fireShard()
    {
        return false;
    }

    // applies an impulse to the player sprite in the given direction and disables movement briefly by setting a flag on the player
    launch(direction)
    {
        this.player.body.velocity.x = Math.cos((direction) * Math.PI / 180) * this.player.shardLaunchVelocity;
        this.player.body.velocity.y = Math.sin((direction) * Math.PI / 180) * this.player.shardLaunchVelocity;
        this.player.launched = true;
        game.time.events.add(Phaser.Timer.SECOND * 0.3, this.clearLaunchState, this)
    }

    // clears the player's launched flag
    clearLaunchState()
    {
        this.player.launched = false;
    }
}