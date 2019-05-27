class PlayerAnimationController
{
    player;
    direction;

    static load()
    {
        game.load.path = 'assets/';
        game.load.atlas('player', 'img/player/player_atlas.png', 'json/player_atlas.json');
        //game.load.spritesheet('player_run_right', 'player_run_right', 32, 32);
        //game.load.spritesheet('player_run_left', 'player_run_left', 32, 32);
    }

    constructor(player)
    {
        this.player = player;

        this.player.animations.add('run_right', Phaser.Animation.generateFrameNames('run_right_', 1, 8), 12, true);
        this.player.animations.add('run_right_up_diagonal', Phaser.Animation.generateFrameNames('run_right_up_diagonal_', 1, 8), 12, true);
        this.player.animations.add('run_right_down_diagonal', Phaser.Animation.generateFrameNames('run_right_down_diagonal_', 1, 8), 12, true);

        this.player.animations.add('stand_still', Phaser.Animation.generateFrameNames('run_right_', 1, 1), 12, true);
        
        this.player.animations.add('run_left', Phaser.Animation.generateFrameNames('run_left_', 1, 8), 12, true);
        this.player.animations.add('run_left_up_diagonal', Phaser.Animation.generateFrameNames('run_left_up_diagonal_', 1, 8), 12, true);
        this.player.animations.add('run_left_down_diagonal', Phaser.Animation.generateFrameNames('run_left_down_diagonal_', 1, 8), 12, true);
        
        for(let i = 1; i < 8; i++)
        {
            this.player.animations.add('jump_right_' + i, Phaser.Animation.generateFrameNames('jump_right_', i, i), 12, true);
            this.player.animations.add('jump_left_' + i, Phaser.Animation.generateFrameNames('jump_left_', i, i), 12, true);
        }

        this.direction = 'right';
        //this.player.animations.add('jump_a',  Phaser.Animation.generateFrameNames('run_right_', i, ), 12, true);
    }

    animateJump()
    {
        this.calculateDirection();
        console.log(this.player.body.velocity.y);
        //this.player.animations.play('jump_1');
        //this.player.animations.play('jump_' + this.direction + '_2');
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

        if()
        {
            
        }

        this.player.animations.play(animation);
    }

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

    animateGround()
    {
        this.calculateDirection();

        if(this.player.inputManager.getHorizontalInput() == 0)
        {
            this.player.animations.play('stand_still');
            return;
        }
        
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
/*
        if(this.player.inputManager.getHorizontalInput() > 0)// if the player is moving right
        {
            if(this.player.stateManager.ground.standingDirection == StandingDirection.DOWN)
            {
                this.player.animations.play('run_right');
            }
            else if(this.player.stateManager.ground.standingDirection == StandingDirection.LEFT)// if I'm on a slant to my right
            {
                this.player.animations.play('run_right_up_diagonal');
            }
            else// if I'm on a slant to my left
            {
                this.player.animations.play('run_right_down_diagonal');
            }
        }
        else if(this.player.inputManager.getHorizontalInput() < 0)// if the player is stationary
        {
            
            if(this.player.stateManager.ground.standingDirection == StandingDirection.DOWN)
            {
                this.player.animations.play('run_left');
            }
            else if(this.player.stateManager.ground.standingDirection == StandingDirection.RIGHT)// if I'm on a slant to my left
            {
                this.player.animations.play('run_left_up_diagonal');
            }
            else// if I'm on a slant to my right
            {
                this.player.animations.play('run_left_down_diagonal');
            }
        }
        else
        {
            this.player.animations.play('stand_still');
        }*/
    }
}