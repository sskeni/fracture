var Credits = {
	create:function()
	{
		game.stage.backgroundColor = '#000';

		logo = game.add.sprite(game.world.centerX, 30, 'logo');
		logo.anchor.set(0.5);

		backButton = game.add.sprite(game.world.centerX, game.world.centerY + 120, 'mainMenuText');
		backButton.anchor.set(0.5);
		backButton.state = 'MainMenu';

		credits = game.add.sprite(game.world.centerX, game.world.centerY + 8, 'credits');
		credits.anchor.set(0.5);

		this.buttonSelector = new ButtonSelector(game, backButton, 'buttonSelector');
		this.buttonSelector.canNavigate = true;
	}
}