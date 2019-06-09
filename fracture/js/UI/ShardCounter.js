"use strict";

//class for shard ui
class ShardCounter
{
    //image variables
    tokens;
    tokenFlashes;
    background;

    //shard gem count, initially full (2)
    currTokenIndex = 2;

    constructor()
    {
        //create background
        this.background = game.add.sprite(0, 0, 'shard_counter_background');
        this.background.fixedToCamera = true;

        //create shard gems
        this.tokens = new Array();
        this.tokens.push(game.add.sprite(6, 3, 'shard_token'));
        this.tokens.push(game.add.sprite(27, 3, 'shard_token'));
        this.tokens.push(game.add.sprite(48, 3, 'shard_token'));

        //create flashes for shard gems
        this.tokenFlashes = new Array();
        this.tokenFlashes.push(game.add.sprite(6, 3, 'token_flash'));
        this.tokenFlashes.push(game.add.sprite(27, 3, 'token_flash'));
        this.tokenFlashes.push(game.add.sprite(48, 3, 'token_flash'));

        //make flashes invisible and fixed to camera
        for(var token of this.tokenFlashes)
        {
            token.alpha = 0;
            token.fixedToCamera = true;
        }

        //add animations and fix to camera
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

            token.fixedToCamera = true;

            //start with shard gems as whole
            token.animations.play('whole');
        }

    }

    static load()
    {
        //load assets
        var path = game.load.path;
        game.load.path = 'fracture/assets/img/shard_counter/';

        game.load.image('shard_counter_background', 'shard_counter_background.png');
        game.load.image('token_flash', 'token_flash.png');
        game.load.atlas('shard_token', 'token_atlas.png', '../../json/token_atlas.json');

        game.load.path = path;
    }

    //reset shard counter ui
    reset()
    {
        //resets shard gem count
        this.currTokenIndex = 2;

        //play animation and reset behavior boolean
        for(var token of this.tokens)
        {
            token.animations.play('reset');
            token.broken = false;
        }

        //after playing reset, set to whole and play flash animation
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

    //behavior for when shard is fired
    beginFireShard()
    {
        if(this.currTokenIndex >= 0)
        {
            for(let i = 0; i < 3; i++)
            {
                if(i == this.currTokenIndex)
                {
                    //play crack animation when shot
                    this.tokens[i].animations.play('crack');
                }
                else
                {
                    if(!this.tokens[i].broken)
                    {
                        //otherwise play flash animation
                        this.tokens[i].animations.play('flash');
                    }
                }
            }
        }
    }

    //puts shard counter ui on top of other game elements
    bringToTop()
    {
        this.background.bringToTop();
        for(var token of this.tokens)
        {
            token.bringToTop();
        }
    }

    //behavior for when firing shard
    fireShard()
    {
        for(let i = 0; i < 3; i++)
        {
            if(i == this.currTokenIndex)
            {
                //play broken animation
                this.tokens[i].animations.play('broken');
                this.tokens[i].broken = true;
            }
            else
            {
                if(!this.tokens[i].broken)
                {
                    //else play flash animation
                    this.flashToken(i);
                }
            }
        }
        this.currTokenIndex -= 1;
    }

    //play flash animation
    flashToken(index)
    {
        this.tokens[index].animations.play('whole');
        this.tokenFlashes[index].bringToTop();
        this.tokenFlashes[index].alpha = 1;
        game.add.tween(this.tokenFlashes[index]).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
    }

}