class FlowerManager
{
	whiteout;
	bloomAnimation;

	flower;
	glow0;
	glow1;
	glow2;
	glow3;
	glow4;

	glow0tween;
	glow1tween;
	glow2tween;
	glow3tween;
	glow4tween;

	constructor()
	{
		this.whiteout = game.add.sprite(0, 0, 'beginning_whiteout');
		this.whiteout.alpha = 0;

		this.flower = game.add.sprite(100, 100, 'flower_bloom', 'flower-0');

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

		this.bloomAnimation = game.add.sprite(100, 100, 'flower_bloom');
		this.bloomAnimation.animations.add('bloom',
			['flower-0', 'flower-1', 'flower-1', 'flower-1', 'flower-0', 'flower-0', 'flower-0', 'flower-1', 'flower-1', 'flower-1', 'flower-1', 'flower-1', 'flower-2', 'flower-2', 'flower-2', 'flower-2'], 12, false);
	}

	static load()
	{
		var path = game.load.path;

		game.load.path = "assets/";
		game.load.atlas('flower_bloom', 'img/flower/flower_animation.png', 'json/flower_animation.json');

		game.load.path = "assets/img/flower/";
		game.load.image('beginning_whiteout', 'beginning_whiteout.png');

		game.load.path = path;
	}

	playAnimation()
	{
		game.time.events.add(1000, this.glow0in, this);
	}

	glow0in()
	{
		this.glow0.bringToTop();
		this.glow0tween = game.add.tween(this.glow0).to( {alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow0tween.onComplete.addOnce(this.glow0out, this);
	}

	glow0out()
	{
		if(this.glow0tween != null)
			this.glow0tween.stop();
		this.glow0tween = game.add.tween(this.glow0).to( {alpha: 0}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow0tween.onComplete.addOnce(this.glow1in, this);
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
		this.glow1tween = game.add.tween(this.glow1).to( {alpha: 0}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow1tween.onComplete.addOnce(this.glow2in, this);
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
		this.glow2tween = game.add.tween(this.glow2).to( {alpha: 0}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow2tween.onComplete.addOnce(this.glow3in, this);
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
		this.glow3tween = game.add.tween(this.glow3).to( {alpha: 0}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow3tween.onComplete.addOnce(this.glow4in, this);
	}

	glow4in()
	{
		this.glow4.bringToTop();
		this.glow4tween = game.add.tween(this.glow4).to( {alpha: 1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow4tween.onComplete.addOnce(this.glow4out, this);
	}

	glow4out()
	{
		if(this.glow4tween != null)
			this.glow4tween.stop();
		this.glow4tween = game.add.tween(this.glow4).to( {alpha: 0}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.glow4tween.onComplete.addOnce(this.playBloom, this);
	}

	playBloom()
	{
		this.flower.destroy();
		this.bloomAnimation.animations.play('bloom');
	}

	startWhiteout()
	{
		this.whiteout.bringToTop();
		this.whiteoutTween = game.add.tween(this.whiteout).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
		this.whiteoutTween.onComplete.addOnce(this.completeWhiteout, this);
	}

	completeWhiteout()
	{
		game.stage.backgroundColor = '#ffffff';
		game.state.start('Play');
	}
}