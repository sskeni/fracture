"use strict";

// all player behavior code should inherit and follow this form
class PlayerState 
{
    stateManager;// the player's state manager
    adjacentStates;// a list of states which should check conditions for transition from this one
    
    constructor(stateManager) 
    {
        this.stateManager = stateManager;
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
}