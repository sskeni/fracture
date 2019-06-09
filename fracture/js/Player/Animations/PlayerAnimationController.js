"use stict";

// manages which player animations should be playing at a given time
class PlayerAnimationController
{
    player;// a reference to the player
    direction;// the player's current facing (left or right)

    deathTween;// a tween for the player fading to nothing when dying

    flashSprite;// a white screen for flashing the screen when the player is about to fall to their death

    // loads the player's texture atlas as well as the flash screen image
    static load()
    {
        game.load.path = 'fracture/assets/';
        game.load.atlas('player', 'img/player/player_atlas.png', 'json/player_atlas.json');
        game.load.image('flash', 'img/heart/ending_whiteout.png');
    }

    constructor(player)
    {
        this.player = player;
        this.direction = 'right';


        // add all player animations
        this.player.animations.add('run_right', Phaser.Animation.generateFrameNames('run_right_', 1, 8), 12, true);
        this.player.animations.add('run_right_up_diagonal', Phaser.Animation.generateFrameNames('run_right_up_diagonal_', 1, 8), 12, true);
        this.player.animations.add('run_right_down_diagonal', Phaser.Animation.generateFrameNames('run_right_down_diagonal_', 1, 8), 12, true);

        this.player.animations.add('idle_left', Phaser.Animation.generateFrameNames('idle_left_', 1, 1), 12, true);
        this.player.animations.add('idle_right', Phaser.Animation.generateFrameNames('idle_right_', 1, 1), 12, true);

        this.player.animations.add('wall_jump_left', Phaser.Animation.generateFrameNames('wall_jump_left_', 1, 1), 12, true);
        this.player.animations.add('wall_jump_right', Phaser.Animation.generateFrameNames('wall_jump_right_', 1, 1), 12, true);
        
        this.player.animations.add('run_left', Phaser.Animation.generateFrameNames('run_left_', 1, 8), 12, true);
        this.player.animations.add('run_left_up_diagonal', Phaser.Animation.generateFrameNames('run_left_up_diagonal_', 1, 8), 12, true);
        this.player.animations.add('run_left_down_diagonal', Phaser.Animation.generateFrameNames('run_left_down_diagonal_', 1, 8), 12, true);
                
        this.player.animations.add('shatter', Phaser.Animation.generateFrameNames('shatter_', 1, 11), 10, false);
        
        this.player.animations.add('fire_shard', Phaser.Animation.generateFrameNames('fire_shard_', 1, 5), 12, false);

        this.player.animations.add('ending', 
        [
            'ending_1',
            'ending_2',
            'ending_3',
            'ending_4',
            'ending_5'
        ],
        6,
        false);
        

        for(let i = 1; i < 8; i++)
        {
            this.player.animations.add('jump_right_' + i, Phaser.Animation.generateFrameNames('jump_right_', i, i), 12, true);
            this.player.animations.add('jump_left_' + i, Phaser.Animation.generateFrameNames('jump_left_', i, i), 12, true);
        }

        // create the flash sprite
        this.flashSprite = game.add.sprite(0, 0, 'flash');
        this.flashSprite.alpha = 0;
        this.flashSprite.fixedToCamera = true;
    }

    // lightens the screen using the flash sprite for the given length of time in seconds
    flashScreen(length)
    {
        if(this.flashTween != null) 
        {
            this.flashTween.stop();
        }
        this.flashSprite.bringToTop();
        this.flashSprite.alpha = 0.5;
        game.time.events.add(Phaser.Timer.SECOND * length, function(){this.flashSprite.alpha = 0;}, this);
    }

    // update loop for player animations while jumping
    animateJump()
    {
        if(this.player.stateManager.currentState != this.player.stateManager.jump)
        {
            return;
        }

        this.calculateDirection();

        // the frame is based on the character's vertical velocity
        var animation = 'jump_' + this.direction;
        if(this.player.body.velocity.y < -250)
        {
            animation = animation + '_1';
        }
        else if(this.player.body.velocity.y < -200)
        {
            animation = animation + '_2';
        }
        else if(this.player.body.velocity.y < -150)
        {
            animation = animation + '_3';
        }
        else if(this.player.body.velocity.y < -50)
        {
            animation = animation + '_4';
        }
        else if(this.player.body.velocity.y < 100)
        {
            animation = animation + '_5';
        }
        else if(this.player.body.velocity.y < 200)
        {
            animation = animation + '_6';
        }
        else
        {
            animation = animation + '_7';
        }

        var distanceToGround = this.player.distanceToGround();

        // unless the player is close to ground, when they should be playing the animation like they're landing
        if(this.player.body.velocity.y > 0)
        {
            if(distanceToGround < 50)
            {
                animation = 'jump_' + this.direction + '_5';
            }
            else if(distanceToGround < 40)
            {
                animation = 'jump_' + this.direction + '_6';            
            }
            else if(distanceToGround < 30)
            {
                animation = 'jump_' + this.direction + '_7';
            }
        }

        this.player.animations.play(animation);
    }

    // determine which direction the player should be facing
    calculateDirection()
    {
        if(this.player.inputManager.getHorizontalInput() > 0)
        {
            this.direction = 'right';
        }
        else if(this.player.inputManager.getHorizontalInput() < 0)
        {
            this.direction = 'left';
        }
    }

    // update loop for player animations while on the ground
    animateGround()
    {
        if(this.player.stateManager.currentState != this.player.stateManager.ground)
        {
            return;
        }

        this.calculateDirection();

        // play the idle animation if the player is stationary
        if(this.player.inputManager.getHorizontalInput() == 0)
        {
            this.player.animations.play('idle_' + this.direction);
            return;
        }
        

        // determine the slant of the ground
        var slant = '';

        if(this.player.stateManager.ground.standingDirection == StandingDirection.LEFT)// if I'm on a slant to my right
        {
            slant = (this.direction == 'right' ? '_up_diagonal' : '_down_diagonal');
        }
        else if(this.player.stateManager.ground.standingDirection == StandingDirection.RIGHT)// if I'm on a slant to my left
        {
            slant = (this.direction == 'right' ? '_down_diagonal' : '_up_diagonal');
        }

        this.player.animations.play('run_' + this.direction + slant);
    }
    
    // plays the death animation
    animateDeath()
    {
        this.player.animations.play('shatter');
        this.deathTween = game.add.tween(this.player).to( { alpha: 0 }, 900, Phaser.Easing.Linear.None, true, 0, 0, false);
    }

    // does housecleaning for respawn
    animateRespawn()
    {
        if(this.deathTween != null) this.deathTween.stop();
        this.player.alpha = 1;
    }
    
    // plays the fire shard animation
    animateFireShard()
    {
        this.player.animations.play('fire_shard');
    }

    // plays the wall jump animation
    animateWallJump()
    {
        if(this.player.stateManager.wallJump.direction == WallDirection.LEFT)
        {
            this.direction = 'left';
        }
        else
        {
            this.direction = 'right';
        }
        this.player.animations.play('wall_jump_' + this.direction);
    }


}