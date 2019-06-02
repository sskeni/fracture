

var MainMenu = {

	preload:function()
	{
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		game.load.path = 'assets/img/';
		game.load.image('background', 'mainMenuBackground.png');
		game.load.image('logo', 'logo.png');
		game.load.image('buttonSelector', 'buttonSelector.png');
	},

	createText:function() {	
		MainMenu.startButton = game.add.text(game.world.centerX, game.world.centerY + 10, 'START');
		MainMenu.startButton.font = "Press Start 2P";
		MainMenu.startButton.fontSize =17;
		MainMenu.startButton.fill = "#ffffff";
		MainMenu.startButton.anchor.set(0.5);
		MainMenu.startButton.state = 'Play';
		
		MainMenu.creditsButton = game.add.text(game.world.centerX, game.world.centerY + 50, 'CREDITS');
		MainMenu.creditsButton.font = "Press Start 2P";
		MainMenu.creditsButton.fontSize = 17;
		MainMenu.creditsButton.fill = "#ffffff";
		MainMenu.creditsButton.anchor.set(0.5);
		MainMenu.creditsButton.state = 'Credits';
	},

	create:function()
	{
		background = game.add.sprite(game.world.width, game.world.height, 'background');
		background.anchor.set(1);

		logo = game.add.sprite(game.world.centerX, game.world.centerY - 60, 'logo');
		logo.anchor.set(0.5);

		
		this.loadingText = true;
		game.time.events.add(1000, function() {
			this.buttonSelector = new ButtonSelector(game, this.startButton, 'buttonSelector');
			this.buttonSelector.addSelection(this.creditsButton);
			this.loadingText = false;
		}, this);
		
		
		
	},
	
	update:function()
	{
		if(!this.loadingText)
		{
			this.buttonSelector.update();
		}
	}
}

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, MainMenu.createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Press Start 2P']
    }

};