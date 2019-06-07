"use strict";

// state manager that plays one player behavior state at a time
class PlayerStateManager 
{
 
    // references
    currentState;// the currently running state
    previousState;// the state currentState was transitioned from

    player;// the player this state is attached to
    inputManager;// the player's InputManager instance

    // states
    ground;
    jump;
    fireShard;
    wallJump;


    constructor(player) 
    {
        this.player = player;
        this.inputManager = player.inputManager;
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

        //reset the player
        if(this.inputManager.resetButtonJustDown())
        {
            this.player.die();
        }
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

    // launches player in the given direction
    launch(direction)
    {
        this.currentState.launch(direction);
    }


    // do housekeeping to transition to the given state
    transitionToState(state)
    {
        this.previousState = this.currentState;
        this.currentState.deinitialize();
        state.initialize();
        this.currentState = state;
    }
    
    // setup all states
    createStateHierarchy()
    {
        // create states
        var ground = new Ground(this);
        this.ground = ground;
        var jump = new Jump(this);
        this.jump = jump;
        var fireShard = new FireShard(this);
        this.fireShard = fireShard;
        var wallJump = new WallJump(this);
        this.wallJump = wallJump;

        // set up Ground state
        this.currentState = ground;
        ground.adjacentStates.push(jump);
        ground.adjacentStates.push(fireShard);
        
        // set up Jump state
        jump.ground = ground;
        jump.adjacentStates.push(fireShard);
        jump.adjacentStates.push(wallJump);

        // set up fire shard state
        fireShard.jumpState = jump;

        // set up wall jump state
        wallJump.jumpState = jump;
        wallJump.adjacentStates.push(fireShard);
    }

}