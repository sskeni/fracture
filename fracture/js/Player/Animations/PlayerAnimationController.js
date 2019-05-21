class PlayerAnimationController
{
    player;

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
        this.player.animations.add('stand_still', Phaser.Animation.generateFrameNames('run_right_', 1, 1), 12, true);
        this.player.animations.add('run_left', Phaser.Animation.generateFrameNames('run_left_', 1, 8), 12, true);
        console.log(this.player.animations.getAnimation('run_right'));
    }

    animateGround()
    {
        if(this.player.inputManager.getHorizontalInput() > 0)// if the player is moving right
        {
            this.player.animations.play('run_right');
        }
        else if(this.player.inputManager.getHorizontalInput() < 0)// if the player is stationary
        {
            this.player.animations.play('run_left');
        }
        else
        {
            this.player.animations.play('stand_still');
        }
    }
}