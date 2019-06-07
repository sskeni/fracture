"use strict"

var MainMenu = {

	preload:function()
	{
		game.load.path = 'assets/img/';
		game.load.image('background', 'mainMenuBackground.png');
		game.load.image('logo', 'logo.png');
		game.load.image('buttonSelector', 'buttonSelector.png');
		game.load.image('startText', 'startText.png');
		game.load.image('creditsText', 'creditsText.png');
		game.load.image('mainMenuText', 'mainMenuText.png');
		game.load.image('resumeText', 'resumeText.png');
		game.load.image('pauseText', 'pauseText.png');
		game.load.image('credits', 'credits.png');
		
		AudioManager.loadUI();
		MusicManager.loadMainMenu();
	},

	create:function()
	{
		game.world.resize(512, 288);

		game.stage.backgroundColor = '#000';

		this.background = game.add.sprite(0, 0, 'background');
		
		this.logo = game.add.sprite(512/2, (288/2) - 60, 'logo');
		this.logo.anchor.set(0.5);

		this.startButton = game.add.sprite(512/2, (288/2) + 10, 'startText');
		this.startButton.anchor.set(0.5);
		this.startButton.state = 'Play';

		this.creditsButton = game.add.sprite(512/2, (288/2) + 50, 'creditsText');
		this.creditsButton.anchor.set(0.5);
		this.creditsButton.state = 'Credits';

		this.buttonSelector = new ButtonSelector(game, this.startButton, 'buttonSelector');
		this.buttonSelector.addSelection(this.creditsButton);

		this.musicManager = new MusicManager();
        this.musicManager.playSong('main_menu');
		this.buttonSelector.canNavigate = true;
	},

	shutdown:function()
	{
		this.musicManager.stop();
	}
}