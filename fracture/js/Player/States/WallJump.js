"use strict";

// Behavior for when the player is firing a shard.
class FireShard extends PlayerState
{

    constructor(stateManager) 
    {
        super(stateManager);
    }

    // called every frame
    run()
    {
        
    }

    initialize()
    {

    }

    deinitialize()
    {

    }

    transitionConditionsMet()
    {
        return false;
    }

}