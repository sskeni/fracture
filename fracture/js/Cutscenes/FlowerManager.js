"use strict";

// manager class for the game's opening cutscene
class FlowerManager
{
	blackout;
	bloomAnimation;

	flower;// a sprite for the animation of the flower opening

	// a series of sprites for use creating the glowing animations before the flower opens
	glow0;
	glow1;
	glow2;
	glow3;
	glow4;

	// a series of tweens to manage the glowing animations
	glow0tween;
	glow1tween;
	glow2tween;
	glow3tween;
	glow4tween;

	constructor(player)
	{
		this.player = player;

		// add a solid black sprite to fade the game to black during the transtion to the play state
		this.blackout = game.add.sprite(0, 0, 'blackout');
		this.blackout.alpha = 0;

		// add the flower animation sprite
		this.flower = game.add.sprite(100, 100, 'flower_bloom', 'flower-0');

		// add the images for the flower's different glow states
		this.glow0 = game.add.sprite(100, 100, 'flower_bloom', 'glow-0');
		this.glow0.alpha = 0;
		this.glow1 = game.add.sprite(100, 100, 'flower_bloom', 'glow-1');
		this.glow1.alpha = 0;
		this.glow2 = game.add.sprite(100, 100, 'flower_bloom', 'glow-2');
		this.glow2.alpha = 0;
		this.glow3 = game.add.sprite(100, 100, 'flower_bloom', 'glow-3');
		this.glow3.alpha = 0;
		this.glow4 = game.add.sprite(100, 100, 'flower_bloom', 'glow-4');
		this.glow4.alpha = 0;

		//setup the animtion for the flower blooming
		this.bloomAnimation = game.add.sprite(100, 100, 'flower_bloom');
		this.bloomAnimation.animations.add('bloom',
			['flower-0', 'flower-0', 'flower-0', 'flower-1', 
			'flower-1', 'flower-1', 'flower-1', 
			'flower-1', 'flower-1', 'flower-1', 'flower-1', 'flower-1', 
			'flower-2', 'flower-2', 'flower-2', 'flower-2'], 12, false);
	}

	// load images
	static load()
	{
		var path = game.load.path;

		game.load.path = "fracture/assets/";
		game.load.atlas('flower_bloom', 'img/flower/flower_animation.png', 'json/flower_animation.json');
		game.load.image('blackout', 'img/blackout.png');

		game.load.path = path;
	}

	// begin the chain of animations that play during the beginning cutscene
	playAnimation()
	{
		game.time.events.add(1000, this.glow0in, this);
	}

	// chain through each glow state, with their beginnings and endings overlapped 

	glow0in()
	{
		this.glow0.bringToTop();
		this.glow0tween = game.add.tween(this.glow0).to( {alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow0tween.onComplete.addOnce(this.glow0out, this);
	}

	glow0out()
	{
		this.music = AudioManager.playSound('beginning', 0.3);
		if(this.glow0tween != null)
			this.glow0tween.stop();
		this.glow0tween = game.add.tween(this.glow0).to( {alpha: 0}, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
		//this.glow0tween.onComplete.addOnce(this.glow1in, this);
		this.glow1in();
	}

	glow1in()
	{
		this.glow1.bringToTop();
		this.glow1tween = game.add.tween(this.glow1).to( {alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow1tween.onComplete.addOnce(this.glow1out, this);
	}

	glow1out()
	{
		if(this.glow1tween != null)
			this.glow1tween.stop();
		this.glow1tween = game.add.tween(this.glow1).to( {alpha: 0}, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
		//this.glow1tween.onComplete.addOnce(this.glow2in, this);
		this.glow2in();
	}

	glow2in()
	{
		this.glow2.bringToTop();
		this.glow2tween = game.add.tween(this.glow2).to( {alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow2tween.onComplete.addOnce(this.glow2out, this);
	}

	glow2out()
	{
		if(this.glow2tween != null)
			this.glow2tween.stop();
		this.glow2tween = game.add.tween(this.glow2).to( {alpha: 0}, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
		//this.glow2tween.onComplete.addOnce(this.glow3in, this);
		this.glow3in();
	}

	glow3in()
	{
		this.glow3.bringToTop();
		this.glow3tween = game.add.tween(this.glow3).to( {alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow3tween.onComplete.addOnce(this.glow3out, this);
	}

	glow3out()
	{
		if(this.glow3tween != null)
			this.glow3tween.stop();
		this.glow3tween = game.add.tween(this.glow3).to( {alpha: 0}, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
		//this.glow3tween.onComplete.addOnce(this.glow4in, this);
		this.glow4in();
	}

	glow4in()
	{
		this.glow4.bringToTop();
		this.glow4tween = game.add.tween(this.glow4).to( {alpha: 1}, 800, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow4tween.onComplete.addOnce(this.glow4out, this);
	}

	// this is the final glow before the bloom
	glow4out()
	{
		if(this.glow4tween != null)
			this.glow4tween.stop();
		this.glow4tween = game.add.tween(this.glow4).to( {alpha: 0.2}, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow4tween.onComplete.addOnce(this.playBloom, this);
	}

	// plays the flower's bloom animation and gives the player control so that they can start the game
	playBloom()
	{
		this.flower.destroy();
		
		// play the bloom animation
		this.bloomAnimation.animations.play('bloom');

		// once the bloom animation finishes, start the tutorial and allow the player to move
		this.bloomAnimation.animations.getAnimation('bloom').onComplete.addOnce(function(){
			this.player.inputManager.enable();
			Beginning.createTutorialManager();
		}, this);
	}

	// begins the transition to the first level by fading to black
	startBlackout()
	{
		this.blackout.bringToTop();
		this.blackoutTween = game.add.tween(this.blackout).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.blackoutTween.onComplete.addOnce(this.completeBlackout, this);// once the blackout is complete, move on to the next state
	}

	// sets everything up to transition to the first level
	completeBlackout()
	{
		this.music.stop();
		game.stage.backgroundColor = '#000000';
		game.state.start('Play');
	}
}