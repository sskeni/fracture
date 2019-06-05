class ShardCounter
{
    tokens;
    tokenFlashes;
    background;

    currTokenIndex = 2;

    constructor()
    {
        this.background = game.add.sprite(0, 0, 'shard_counter_background');

        this.tokens = new Array();
        this.tokens.push(game.add.sprite(6, 3, 'shard_token'));
        this.tokens.push(game.add.sprite(27, 3, 'shard_token'));
        this.tokens.push(game.add.sprite(48, 3, 'shard_token'));

        this.tokenFlashes = new Array();
        this.tokenFlashes.push(game.add.sprite(6, 3, 'token_flash'));
        this.tokenFlashes.push(game.add.sprite(27, 3, 'token_flash'));
        this.tokenFlashes.push(game.add.sprite(48, 3, 'token_flash'));

        for(var token of this.tokenFlashes)
        {
            token.alpha = 0;
        }

        for(var token of this.tokens)
        {
            token.broken = false;
            token.animations.add('whole', 
            ['flash_1',],
            12, false);
            token.animations.add('broken', 
            ['broken_1',
            'broken_2',
            'broken_3',
            'broken_4',],
            12, false);
            token.animations.add('flash', 
            ['flash_1',
            'flash_2',
            'flash_3',
            'flash_4',
            'flash_5',
            'flash_6',],
            12, false);
            token.animations.add('crack', 
            ['crack_1',
            'crack_2',
            'crack_3',
            'crack_4',
            'crack_5',
            'crack_6',],
            12, false);
            token.animations.add('reset', 
            ['crack_6',
            'crack_5',
            'crack_4',
            'crack_3',
            'crack_2',
            'crack_1',],
            12, false);

            token.animations.play('whole');
        }

    }

    static load()
    {
        var path = game.load.path;
        game.load.path = 'assets/img/shard_counter/';

        game.load.image('shard_counter_background', 'shard_counter_background.png');
        game.load.image('token_flash', 'token_flash.png');
        game.load.atlas('shard_token', 'token_atlas.png', '../../json/token_atlas.json');

        game.load.path = path;
    }

    reset()
    {
        this.currTokenIndex = 2;
        for(var token of this.tokens)
        {
            token.animations.play('reset');
            token.broken = false;
        }

        this.tokens[0].animations.getAnimation('reset').onComplete.addOnce(function(){
            for(var token of this.tokens)
            {
                token.animations.play('whole');
            }
            for(let i = 0; i < 3; i++)
            {
                this.flashToken(i);
            }
        }, this);
    }

    beginFireShard()
    {
        if(this.currTokenIndex >= 0)
        {
            for(let i = 0; i < 3; i++)
            {
                if(i == this.currTokenIndex)
                {
                    this.tokens[i].animations.play('crack');
                }
                else
                {
                    if(!this.tokens[i].broken)
                    {
                        this.tokens[i].animations.play('flash');
                    }
                }
            }
        }
    }

    bringToTop()
    {
        this.background.bringToTop();
        for(var token of this.tokens)
        {
            token.bringToTop();
        }
    }

    fireShard()
    {
        for(let i = 0; i < 3; i++)
        {
            if(i == this.currTokenIndex)
            {
                this.tokens[i].animations.play('broken');
                this.tokens[i].broken = true;
            }
            else
            {
                if(!this.tokens[i].broken)
                {
                    this.flashToken(i);
                }
            }
        }
        this.currTokenIndex -= 1;
    }

    flashToken(index)
    {
        this.tokens[index].animations.play('whole');
        this.tokenFlashes[index].bringToTop();
        this.tokenFlashes[index].alpha = 1;
        game.add.tween(this.tokenFlashes[index]).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
    }

}