"use strict";

//state for credits menu
var Credits = {
	init:function(startWithFade = false)
	{
		//used to check if coming from end of game
		this.startWithFade = startWithFade;
	},

	preload()
	{
		//used for transitioning to credits from end of game
		if(this.startWithFade)
		{
			game.load.path = 'fracture/assets/img/heart/'
			game.load.image('whiteout', 'ending_whiteout.png');
		}
	},

	create:function()
	{
		game.stage.backgroundColor = '#000000';
		
		//game logo
		this.logo = game.add.sprite(512/2, 30, 'logo');
		this.logo.anchor.set(0.5);
		
		//back button
		this.backButton = game.add.sprite(512/2, (288/2) + 120, 'mainMenuText');
		this.backButton.anchor.set(0.5);
		this.backButton.state = 'MainMenu';
		
		//credits text image
		this.credits = game.add.sprite(512/2, (288/2) + 8, 'credits');
		this.credits.anchor.set(0.5);
		
		//button selector for menu ui
		this.buttonSelector = new ButtonSelector(game, this.backButton, 'buttonSelector');
		this.buttonSelector.canNavigate = true;

		//end of game tween
		if(this.startWithFade)
		{
			this.whiteout = game.add.sprite(0, 0, 'whiteout');
			this.whiteoutTween = game.add.tween(this.whiteout).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true, 0, 0, false);
		}
	}
}