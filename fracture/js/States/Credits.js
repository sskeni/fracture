var Credits = {
	init:function(startWithFade = false)
	{
		this.startWithFade = startWithFade;
	},

	preload()
	{
		if(this.startWithFade)
		{
			game.load.path = 'assets/img/heart/'
			game.load.image('whiteout', 'ending_whiteout.png');
		}
	},

	create:function()
	{
		
		game.stage.backgroundColor = '#000000';
		
		logo = game.add.sprite(512/2, 30, 'logo');
		logo.anchor.set(0.5);
		
		backButton = game.add.sprite(512/2, (288/2) + 120, 'mainMenuText');
		backButton.anchor.set(0.5);
		backButton.state = 'MainMenu';
		
		credits = game.add.sprite(512/2, (288/2) + 8, 'credits');
		credits.anchor.set(0.5);
		
		this.buttonSelector = new ButtonSelector(game, backButton, 'buttonSelector');
		this.buttonSelector.canNavigate = true;

		if(this.startWithFade)
		{
			
			this.whiteout = game.add.sprite(0, 0, 'whiteout');
			this.whiteoutTween = game.add.tween(this.whiteout).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true, 0, 0, false);
		}
	}
}