"use strict";

// state manager that plays one player behavior state at a time
class PlayerStateManager 
{
    currentState;// the currently running state

    transitionCooldownLength = 50;// how long in ms to wait after transitioning before allowing another transition
    transitionTime = 0;// the time when we can next transition

    constructor(player) 
    {
        this.player = player;
        this.createStateHierarchy();
    }

    // run at the end of create for best results
    initialize()
    {
        this.currentState.initialize();
    }

    // call this every frame to run the character
    update()
    {
        this.currentState.run();// run the current state's behavior
        this.transitionUnderConditions(this.currentState);// check to see if we need to transition to a new state
    }

    // checks the current state's adjacents states for their transition conditions and transition if they are met
    transitionUnderConditions(state) 
    {
        for(var i = 0; i < state.adjacentStates.length; i++)
        {
            if (state.adjacentStates[i].transitionConditionsMet())// if we've met the conditions to transition to a one of the adjacent state
            {
                this.transitionToState(state.adjacentStates[i]);// transition to the new state
                return;
            }
        }
    }

    // do housekeeping to transition to the given state
    transitionToState(state) 
    {
        if(this.player.game.time.now > this.transitionTime)// if it's been long enough since the last scene transition
        {
            this.currentState.deinitialize();
            state.initialize();
            this.currentState = state;
        }
        this.transitionTime = this.player.game.time.now + this.transitionCooldownLength;
    }
    
    // setup all states
    createStateHierarchy() 
    {
        var climbing = new Climbing(this);
        climbing.defaultLocation = this.player.body.y;
        this.currentState = climbing;
        var swapSides = new SwapSides(this);
        climbing.adjacentStates.push(swapSides);
        swapSides.climbingState = climbing;
    }

}