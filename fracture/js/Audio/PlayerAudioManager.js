"use strict";

// plays player sound effects
class PlayerAudioManager
{
    warningDistance = 100;
    volumeModifier = 1;

    playedFootstep = false;
    playedShatterAnticipation = false;

    shardWindupSound;
    shardFlySound;
    fallingSound;

    fireShardTime;

    constructor(player)
    {
        this.player = player;
    }

    // load assets used for player audio
    static load()
    {
        var path = game.load.path;

        game.load.path = 'assets/audio/sfx/player/';
        game.load.audio('begin_fire_shard', 'begin_fire_shard.mp3');
        game.load.audio('falling', 'falling.mp3');
        game.load.audio('fire_shard', 'fire_shard.mp3');
        game.load.audio('footstep_1', 'footstep_1.mp3');
        game.load.audio('footstep_2', 'footstep_2.mp3');
        game.load.audio('footstep_3', 'footstep_3.mp3');
        game.load.audio('footstep_4', 'footstep_4.mp3');
        game.load.audio('jump', 'jump.mp3');
        game.load.audio('land', 'land.mp3');
        game.load.audio('shard_fly', 'shard_fly.mp3');
        game.load.audio('shard_impact', 'shard_impact.mp3');
        game.load.audio('shatter', 'shatter.mp3');
        game.load.audio('shatter_anticipation', 'shatter_anticipation.mp3');

        game.load.path = path;
    }

    // play a sound with the given key and volume
    playSound(key, volume)
    {
        var sound = game.add.audio(key, this.volumeModifier * volume);
        sound.playOnce = true;
        sound.play();

        return sound;
    }

    // select and play a random footstep sound
    playFootstep()
    {
        var index = game.rnd.integerInRange(1, 4);
        var sound = game.add.audio('footstep_' + index, this.volumeModifier * 0.3);
        sound.playOnce = true;
        sound.play();
    }

    updateJump()
    {
        var jump = this.player.stateManager.jump;


        // if falling to the platform could kill the player, warn them
        if(this.player.body.y - jump.maxHeight + this.player.distanceToGround() > jump.calculateMaxFallHeight())
        {
            this.fallingSound.volume = (this.player.body.y - jump.maxHeight)/jump.calculateMaxFallHeight();
        }
        else
        {
            this.fallingSound.volume = 0;
        }
        
        if(jump.fallenTooFar() && !this.aboveShard() && !this.playedShatterAnticipation)
        {
            this.fallingSound.stop();
            this.playSound('shatter_anticipation', 0.3);
            this.playedShatterAnticipation = true;
        }
    }

    // returns whether the player is above a shard right now
    aboveShard()
    {
        var position = new Vector(this.player.body.x, this.player.body.y);
        var direction = new Vector(0, 1000);
        var minDistance = 1000;

        // determine the height of the closest shard
        for(var shard of this.player.shards)
        {
            if(shard.planted)
            {
                var hitLocation = Raycast.raycastToRectangle(shard.rectangle, position, direction);
                if(hitLocation != false)
                {
                    var distance = position.distance(hitLocation);
                    if(minDistance > distance)
                    {
                        minDistance = distance;
                    }
                }
            }
        }

        for(var target of this.player.raycastTargets)
        {
            if(target.y > this.player.body.y)
            {
                var hitLocation = Raycast.raycastToRectangle(target.rectangle, position, direction);
                if(hitLocation != false)
                {
                    var distance = position.distance(hitLocation);
                    if(minDistance > distance)
                    {
                        // if even one floor tile is closer, we're going to fall on it instead of the shard
                        return false;
                    }
                }
            }
        }

        return true;
    }


    // starts the warning sound for falling too far
    initializeJump()
    {
        this.fallingSound = this.playSound('falling', 0);
        this.playedShatterAnticipation = false;
    }

    // stops the warning sound for falling to far
    deinitializeJump()
    {
        this.fallingSound.stop();
    }

    // plays footstep sounds based on the current frame of animation
    updateGround()
    {
        // if we are on the heel touch frame of the animation, play a footstep sound
        if(this.player.animations.frameName == this.player.animations.currentAnim.name + '_2' || this.player.animations.frameName == this.player.animations.currentAnim.name + '_6')// 3, 7
        {
            if(!this.playedFootstep)
            {
                this.playFootstep();
                this.playedFootstep = true;
            }
        }
        else
        {
            this.playedFootstep = false;
        }
    }

    // plays the windup sound for firing a shard
    playShardWindup()
    {
        this.shardWindupSound = this.playSound('begin_fire_shard', 0.3);
    }

    // plays the fire shard sound. also cuts off the shard windup sound
    playFireShard()
    {
        this.shardWindupSound.stop();
        this.playSound('fire_shard', 0.3);
        this.shardFlySound = this.playSound('shard_fly', 0.3);
        this.fireShardTime = game.time.now;
    }

    // plays the sound for when the a shard lands
    playShardImpact()
    {
        this.shardFlySound.stop();

        // ensures that there will always be some delay between the sound for shard firing and shard impact
        if(game.time.now - this.fireShardTime > Phaser.Timer.SECOND * 0.3)
        {
            this.playSound('shard_impact', 0.3);
        }
        else
        {
            var waitTime = ((game.time.now - this.fireShardTime) != 0 ? (0.3 - (game.time.now - this.fireShardTime)) : Phaser.Timer.SECOND *  0.1);
            game.time.events.add(waitTime, function() {this.playSound('shard_impact', 0.3);}, this);
        }
    }
}