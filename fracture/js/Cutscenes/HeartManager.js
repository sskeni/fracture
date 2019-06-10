"use strict";

// manages a series of one-off behaviors for the ending cutscene 
class HeartManager
{
    shatterAnimation;// a sprite for the cracking/shattering animation for the heart
    noLight;// a sprite for the version of the heart image that isn't glowing
    light;// a sprite for the version of the heart image that is glowing
    brightLight;// a sprite for the bright heart image after the heart cracks
    whiteout;// a sprite for the fade to solid white at the end of the cutscene

    lightTween;// a reference to the tween that fades in the heart with light
    brightTween;// a reference to the tween that fades in the heart with bright light after shattering
    whiteoutTween;// a reference to the tween that fades in the solid white at the end of the cutscene

    onComplete;// a function to call when the whiteout animation completes

    constructor()
    {
        this.noLight = game.add.sprite(0, 0, 'ending_no_light');// ending background without shining light
        
        this.light = game.add.sprite(0, 0, 'ending_light');// ending background with shining light
        this.light.alpha = 0;
        this.goLight();// begin the heartbeat/glow animation

        // create shatter animation. this will play during the ending cutscene
        this.shatterAnimation = game.add.sprite(0, 0, 'heart_shatter');
        this.shatterAnimation.alpha = 0;// don't display the animation yet
        this.shatterAnimation.animations.add('shatter', 
        ['ending_crack_1', 'ending_crack_1', 'ending_crack_1','ending_crack_1', 'ending_crack_1', 
        'ending_crack_2','ending_crack_2','ending_crack_2','ending_crack_2','ending_crack_2', 
        'ending_crack_3', 'ending_crack_3','ending_crack_3', 'ending_crack_3', 'ending_crack_3', 'ending_crack_3','ending_crack_3', 'ending_crack_3', 'ending_crack_3', 'ending_crack_3','ending_crack_3', 'ending_crack_3', 
        'ending_crack_4', 'ending_crack_4', 'ending_crack_4', 'ending_crack_4', 'ending_crack_4', 'ending_crack_4', 
        'ending_crack_5', 'ending_crack_5', 'ending_crack_5', 'ending_crack_5', 'ending_crack_5', 'ending_crack_5', 
        'ending_crack_6', 'ending_crack_6', 'ending_crack_6', 'ending_crack_6', 'ending_crack_6', 'ending_crack_6', 
        'ending_crack_7',],
        12,
        false);

        this.brightLight = game.add.sprite(0, 0, 'ending_bright_light');// ending background with shining light
        this.brightLight.alpha = 0;

        this.whiteout = game.add.sprite(0, 0, 'ending_whiteout');// ending background with shining light
        this.whiteout.alpha = 0;

    }

    // load images for use in the cutscene
    static load()
    {
        var path = game.load.path;
        game.load.path = "assets/";
        
        game.load.atlas('heart_shatter', 'img/heart/heart_shatter_atlas.png', 'json/heart_shatter_atlas.json');
        
        game.load.path = "assets/img/heart/";
        game.load.image('ending_no_light', 'ending_no_light.png');
        game.load.image('ending_light', 'ending_light.png');
        game.load.image('ending_bright_light', 'ending_bright_light.png');
        game.load.image('ending_whiteout', 'ending_whiteout.png');

        game.load.path = path;
    }

    // fades in the light background
    goLight()
    {
        if(this.lightTween != null) 
        {
            this.lightTween.stop();
        }
        this.lightTween = game.add.tween(this.light).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        this.lightTween.onComplete.addOnce(this.goDark, this);
    }
    
    // fades out the light background
    goDark()
    {
        EndingMusicManager.playHeartbeat();
        if(this.lightTween != null) 
        {
            this.lightTween.stop();
        }

        // wait for a bit before dissipating the light again
        game.time.events.add(400, function() {
            this.lightTween = game.add.tween(this.light).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.lightTween.onComplete.addOnce(this.goLight, this);

        }, this);

    }

    // plays the shatter animation
    playAnimation()
    {
        // some camera shake at different times
        GamefeelMaster.shakeCamera(0.00002, 0, 100, 0.000001, 100, 100);
        game.time.events.add(2000, function(){GamefeelMaster.shakeCamera(0.00002, 0, 100, 0.000001, 100, 100);}, this);
        game.time.events.add(3600, function(){GamefeelMaster.shakeCamera(0.00005, 0, 6000, 0.000001, 200, 200);}, this);
        
        // stop the heartbeat/glow animation
        if(this.lightTween != null)
        {
            this.lightTween.onComplete.removeAll(this);
            this.lightTween.stop();
        }
        this.light.alpha = 0;

        // and an animation to play along with the camera shake
        this.shatterAnimation.alpha = 1;
        this.shatterAnimation.animations.getAnimation('shatter').onComplete.addOnce(this.goBright, this);
        this.shatterAnimation.animations.play('shatter');
    }

    // fades in the brightest background
    goBright()
    {
        //this.shatterAnimation.alpha = 0;
        this.brightTween = game.add.tween(this.brightLight).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        this.brightTween.onComplete.addOnce(this.startWhiteout, this);
    }

    // fades in the white screen cover
    startWhiteout()
    {
        this.whiteout.bringToTop();
        this.whiteoutTween = game.add.tween(this.whiteout).to( { alpha: 1 }, 4000, Phaser.Easing.Linear.None, true, 0, 0, false);
        this.whiteoutTween.onComplete.addOnce(this.completeWhiteout, this);
    }

    // we're done with the cutscene and we're ready to go to credits
    completeWhiteout()
    {
		game.stage.backgroundColor = '#ffffff';
        game.state.start('Credits', true, false, true);
    }
}