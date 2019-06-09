"use strict";

// manages fading in and out tutorial text at the appropriate times
class TutorialManager
{
    player;// a reference to the player

    stationaryDistanceThreshold = 20;// how far the player must move from their previous position in the time limit to be considered not stuck
    stationaryWaitTime = 5;// the time to wait before displaying the reset message when the player is stationary

    // a series of sprites for each tutorial message
    moveMessage;
    jumpMessage;
    pauseMessage;
    shootMessage;
    restartMessage;
    buttontMessage;

    // for determining if the player is stuck
    previousPlayerPosition;// the last position of the player (after moving far enough away from the previous position)
    timeOfLastMove;// the time when the player last moved far enough to be considered not stuck

    // a series of tweens for fading in and out each tutorial message
    restartTween;
    moveTween;
    jumpTween;
    shootTween;
    buttonTween;
    
    currentTutorialIndex = 0;// the index of the current tutorial state
    tutorialStates;// this is an array of update methods representing the correct tutorial behavior at any given time
    
    restartMessageVisible = false;// keeps track of whether the restart message is visable

    constructor(player, type)
    {
        this.player = player;
        this.type = type;

        this.previousPlayerPosition = new Vector(0, 0);

        // determine whether we're in the beginning cutscene room or the main Play state
        if(type == 1)// for the beginning cutscene room
        {
            // the sequence of tutorial states to play when in the beginning cutscene room
            this.tutorialStates = new Array();
            this.tutorialStates.push(this.beginMovementTutorial);
            this.tutorialStates.push(this.updateMovementTutorial);

            // populate and make invisable all tutorial messages
            this.moveMessage = game.add.sprite(0, 0, 'keys_tutorial');
            this.moveMessage.alpha = 0;
        }
        else if(type == 2)// for the main Play state
        {
            // the sequence of tutorial states to play when in the main Play state
            this.tutorialStates = new Array();
            this.tutorialStates.push(this.pauseTutorial);
            this.tutorialStates.push(this.beginJumpTutorial);
            this.tutorialStates.push(this.updateJumpTutorial);
            this.tutorialStates.push(this.beginShootTutorial);
            this.tutorialStates.push(this.updateShootTutorial);
            this.tutorialStates.push(this.beginButtonTutorial);
            this.tutorialStates.push(this.updateButtonTutorial);

            // populate and make invisable all tutorial messages
            this.jumpMessage = game.add.sprite(0, 0, 'jump_tutorial');
            this.jumpMessage.alpha = 0;
            this.shootMessage = game.add.sprite(0, 0, 'shoot_tutorial');
            this.shootMessage.alpha = 0;
            this.restartMessage = game.add.sprite(0, 0, 'restart_tutorial');
            this.restartMessage.alpha = 0;
            this.buttonMessage = game.add.sprite(0, 0, 'button_tutorial');
            this.buttonMessage.alpha = 0;
        }
    }

    // load all tutorial message images
    static load()
    {
        var path = game.load.path;
        game.load.path = 'fracture/assets/img/tutorial/'
        
        game.load.image('jump_tutorial', 'Jump.png');
        game.load.image('keys_tutorial', 'Keys.png');
        game.load.image('pause_tutorial', 'Pause.png');
        game.load.image('restart_tutorial', 'Restart.png');
        game.load.image('shoot_tutorial', 'Shoot.png');
        game.load.image('button_tutorial', 'Button.png');

        game.load.path = 'assets/img/';
        game.load.image('blackout', 'blackout.png');

        game.load.path = path;
    }
    
    // run the current tutorial state behavior
    update()
    {
        // if we're not in the beginning cutscene room, we're liable to get stuck
        if(this.type == 2)
        {
            // determine if player has stood still for too long
            var playerPosition = new Vector(this.player.body.x, this.player.body.y);
            if(playerPosition.distance(this.previousPlayerPosition) > this.stationaryDistanceThreshold)
            {
                // if we've moved far enough, reset the timer and save the new previous position
                this.setRestartMessageVisible(false);
                this.previousPlayerPosition = playerPosition;
                this.timeOfLastMove = game.time.now;
            }
            else if(game.time.now > this.timeOfLastMove + (this.stationaryWaitTime * Phaser.Timer.SECOND))
            {
                // if so instructions on how to restart
                this.setRestartMessageVisible(true);
            }
    
            // if the player just pressed the reset button, they know what the reset button is
            if(this.player.inputManager.resetButtonJustDown())
            {
                this.setRestartMessageVisible(false);
                this.restartMessage.alpha = 0;
            }
        }

        // if there are no more tutorials, don't do anything else
        if(this.currentTutorialIndex == -1)
        {
            return;
        }

        // if there is a tutorial left, play it
        this.tutorialStates[this.currentTutorialIndex](this);
    }

    // tells the player how to pause at the beginning of the first level, before allowing them to move
    pauseTutorial(context)
    {
        // blackout everything, disable character movement, and display how to pause before fading into the game
        context.blackout = game.add.sprite(0, 0, 'blackout');
        context.pauseMessage = game.add.sprite(0, 0, 'pause_tutorial');
        
        context.player.inputManager.disable();

        // wait a bit, fade out the message, then fade out the blackout
        game.time.events.add(2000, function(){
            // fade message out
            var pauseTween = game.add.tween(this.pauseMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            
            // when fading is done
            pauseTween.onComplete.addOnce(function(){
                
                // fade out the background
                var blackoutTween = game.add.tween(this.blackout).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
                
                // when fading out the blackout is done
                blackoutTween.onComplete.addOnce(function(){

                    // allow the player to move again
                    this.player.inputManager.enable();
                    this.timeOfLastMove = game.time.now;

                }, context);
            }, context);
        }, context);

        context.nextTutorial();
    }

    // toggle the visibility of the restart message by way of fade
    setRestartMessageVisible(visible)
    {
        if(this.restartMessageVisible == visible)// do nothing if we're already in the right state
        {
            return;
        }

        this.restartMessageVisible = visible;
        if(visible)
        {
            this.restartMessage.bringToTop();
            if(this.restartTween != null) this.restartTween.stop();
            this.restartTween = game.add.tween(this.restartMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
        else
        {
            if(this.restartTween != null) this.restartTween.stop();
            this.restartTween = game.add.tween(this.restartMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
    }

    // progess to the next tutorial state
    nextTutorial()
    {
        this.currentTutorialIndex++;

        // get whatever button there is in the current level just in case we need to do the button tutorial
        if('tilemapManager' in game.state.getCurrentState()) this.button = game.state.getCurrentState().tilemapManager.buttons.getTop();

        if(this.currentTutorialIndex == this.tutorialStates.length || this.currentTutorialIndex == 0)
        {
            this.currentTutorialIndex = -1;
        }
    }

    // fades in the movement tutorial message
    beginMovementTutorial(context)
    {
        context.moveTween = game.add.tween(context.moveMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.firstTime = true;
        context.nextTutorial();
    }

    // fades out the movement tutorial message when the player moves
    updateMovementTutorial(context)
    {
        if(context.player.inputManager.getHorizontalInput() != 0 && context.firstTime)
        {
            context.firstTime = false;
            if(context.moveTween != null) context.moveTween.stop();
            context.moveTween = game.add.tween(context.moveMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            context.moveTween.onComplete.addOnce(function(){
                this.nextTutorial();
            }, context)
        }
    }
    
    // fades in the jump tutorial message
    beginJumpTutorial(context)
    {
        context.firstTime = true;
        context.jumpTween = game.add.tween(context.jumpMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.nextTutorial();
    }

    // fades out the jump tutorial message when the player jumps
    updateJumpTutorial(context)
    {
        if(context.player.inputManager.jumpButtonJustDown() != 0 && context.firstTime)
        {
            context.firstTime = false;
            if(context.jumpTween != null) context.jumpTween.stop();
            context.jumpTween = game.add.tween(context.jumpMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
    }

    // fades in the fire shard tutorial message
    beginShootTutorial(context)
    {
        context.shootMessage.bringToTop();
        context.shootTween = game.add.tween(context.shootMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.firstTime = true;
        context.nextTutorial();
    }

    // fades out the fire shard tutorial message when the player fires a shard
    updateShootTutorial(context)
    {
        if(context.player.inputManager.shardButtonJustDown() != 0 && context.firstTime)
        {
            context.firstTime = false;

            if(context.shootTween != null) context.shootTween.stop();
            context.shootTween = game.add.tween(context.shootMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            context.shootTween.onComplete.addOnce(function(){
                this.nextTutorial();
            }, context)
        }
    }

    // fades in the button tutorial message
    beginButtonTutorial(context)
    {
        context.buttonMessage.bringToTop();
        context.buttonTween = game.add.tween(context.buttonMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.firstTime = true;
        context.nextTutorial();
    }

    // fades out the button tutorial message when the player hits a button with a shard
    updateButtonTutorial(context)
    {
        if(context.button.pressed && context.firstTime)
        {
            context.firstTime = false;

            if(context.shootTween != null) context.buttonTween.stop();
            context.buttonTween = game.add.tween(context.buttonMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            context.buttonTween.onComplete.addOnce(function(){
                this.nextTutorial();
            }, context)
        }
    }
}