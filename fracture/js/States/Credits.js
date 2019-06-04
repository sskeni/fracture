var Credits = {

	preload:function()
	{
		game.load.path = 'assets/img/';
	},

	create:function()
	{
		backButton = game.add.text(game.world.centerX, game.world.centerY, 'BACK', {fill: '#fff'});
		backButton.anchor.set(0.5);
		backButton.state = 'MainMenu';

		this.buttonSelector = new ButtonSelector(game, backButton, 'buttonSelector');
	},

	update:function()
	{
		this.buttonSelector.update();
	}
}