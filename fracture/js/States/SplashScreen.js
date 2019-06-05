var SplashScreen = {
	preload:function()
	{

	},

	create:function()
	{
		instructions = game.add.text(game.world.centerX, game.world.centerY, 'Arrow keys to navigate the menu.\nZ to select.\n\nPress Z to continue...', {font: '20px', fill: '#fff', align: 'center'});
		instructions.anchor.set(0.5);

		this.continueKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
	},

	update:function()
	{
		if(this.continueKey.justDown) game.state.start('MainMenu');
	}
}