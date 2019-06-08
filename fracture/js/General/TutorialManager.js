"use strict";

class TutorialManager
{
    player;

    stationaryDistanceThreshold = 100;
    stationaryWaitTime = 5;// the time to wait before displaying the reset message when the player is stationary

    moveMessage;
    jumpMessage;
    pauseMessage;
    shootMessage;
    restartMessage;
    buttontMessage;

    previousPlayerPosition;
    timeOfLastMove;

    restartTween;
    moveTween;
    jumpTween;
    shootTween;
    buttonTween;
    
    currentTutorialIndex = 0;
    tutorialStates;// this is an array of update methods representing the correct tutorial behavior at any given time
    

    restartMessageVisible = false;

    constructor(player, type)
    {
        this.player = player;
        this.type = type;

        this.previousPlayerPosition = new Vector(0, 0);


        if(type == 1)
        {
            this.tutorialStates = new Array();
            this.tutorialStates.push(this.beginMovementTutorial);
            this.tutorialStates.push(this.updateMovementTutorial);
        }
        else if(type == 2)
        {
            this.tutorialStates = new Array();
            /*this.tutorialStates.push(this.beginMovementTutorial);
            this.tutorialStates.push(this.updateMovementTutorial);*/
            this.tutorialStates.push(this.pauseTutorial);
            this.tutorialStates.push(this.beginJumpTutorial);
            this.tutorialStates.push(this.updateJumpTutorial);
            this.tutorialStates.push(this.beginShootTutorial);
            this.tutorialStates.push(this.updateShootTutorial);
            this.tutorialStates.push(this.beginButtonTutorial);
            this.tutorialStates.push(this.updateButtonTutorial);
        }


        this.moveMessage = game.add.sprite(0, 0, 'keys_tutorial');
        this.moveMessage.alpha = 0;
        this.jumpMessage = game.add.sprite(0, 0, 'jump_tutorial');
        this.jumpMessage.alpha = 0;
        this.shootMessage = game.add.sprite(0, 0, 'shoot_tutorial');
        this.shootMessage.alpha = 0;
        this.restartMessage = game.add.sprite(0, 0, 'restart_tutorial');
        this.restartMessage.alpha = 0;
        this.buttonMessage = game.add.sprite(0, 0, 'button_tutorial');
        this.buttonMessage.alpha = 0;
    
        
    }

    static load()
    {
        var path = game.load.path;
        game.load.path = 'assets/img/tutorial/'
        
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
    
    update()
    {
        
        if(this.type == 2)
        {
            // determine if player has stood still for too long
            // if so display restart message
            var playerPosition = new Vector(this.player.body.x, this.player.body.y);
            if(playerPosition.distance(this.previousPlayerPosition) > this.stationaryDistanceThreshold)
            {
                this.setRestartMessageVisible(false);
                this.previousPlayerPosition = playerPosition;
                this.timeOfLastMove = game.time.now;
            }
            else if(game.time.now > this.timeOfLastMove + (this.stationaryWaitTime * Phaser.Timer.SECOND))
            {
                this.setRestartMessageVisible(true);
            }
    
            if(this.player.inputManager.resetButtonJustDown())
            {
                this.setRestartMessageVisible(false);
            }
        }

        if(this.currentTutorialIndex == -1)
        {
            return;
        }

        this.tutorialStates[this.currentTutorialIndex](this);
    }

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

    nextTutorial()
    {
        this.currentTutorialIndex++;
        if('tilemapManager' in game.state.getCurrentState()) this.button = game.state.getCurrentState().tilemapManager.buttons.getTop();

        if(this.currentTutorialIndex == this.tutorialStates.length || this.currentTutorialIndex == 0)
        {
            this.currentTutorialIndex = -1;
        }
    }

    beginMovementTutorial(context)
    {
        context.moveTween = game.add.tween(context.moveMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.firstTime = true;
        context.nextTutorial();
    }

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

    beginJumpTutorial(context)
    {
        context.firstTime = true;
        context.jumpTween = game.add.tween(context.jumpMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.nextTutorial();
    }

    updateJumpTutorial(context)
    {
        if(context.player.inputManager.jumpButtonJustDown() != 0 && context.firstTime)
        {
            context.firstTime = false;
            if(context.jumpTween != null) context.jumpTween.stop();
            context.jumpTween = game.add.tween(context.jumpMessage).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
    }

    beginShootTutorial(context)
    {
        context.shootMessage.bringToTop();
        context.shootTween = game.add.tween(context.shootMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.firstTime = true;
        context.nextTutorial();
    }

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

    beginButtonTutorial(context)
    {
        context.buttonMessage.bringToTop();
        context.buttonTween = game.add.tween(context.buttonMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        context.firstTime = true;
        context.nextTutorial();
    }

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