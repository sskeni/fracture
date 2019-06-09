"use strict";

//state for splash screen
//this state is kept light for faster loading
var SplashScreen = {
	create:function()
	{
		//instuctions message
		this.instructions = game.add.text(game.world.centerX, game.world.centerY, 'Arrow keys to navigate the menu.\nZ to select.\n\nPress Z to continue...', {font: '20px', fill: '#fff', align: 'center'});
		this.instructions.anchor.set(0.5);

		//add key to continue
		this.continueKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
	},

	update:function()
	{
		//check for continue key
		if(this.continueKey.justDown) game.state.start('MainMenu');
	}
}