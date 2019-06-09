"use strict";

//state for main menu
var MainMenu = {

	preload:function()
	{
		//load assets for menu
		game.load.path = 'fracture/assets/img/';
		game.load.image('background', 'mainMenuBackground.png');
		game.load.image('logo', 'logo.png');
		game.load.image('buttonSelector', 'buttonSelector.png');
		game.load.image('startText', 'startText.png');
		game.load.image('creditsText', 'creditsText.png');
		game.load.image('mainMenuText', 'mainMenuText.png');
		game.load.image('resumeText', 'resumeText.png');
		game.load.image('pauseText', 'pauseText.png');
		game.load.image('credits', 'credits.png');
		
		//load audio
		AudioManager.loadUI();
		MusicManager.loadMainMenu();
	},

	create:function()
	{
		//resize screen
		game.world.resize(512, 288);

		//set background color
		game.stage.backgroundColor = '#000';

		//create background shards
		this.background = game.add.sprite(0, 0, 'background');
		
		//create logo
		this.logo = game.add.sprite(512/2, (288/2) - 60, 'logo');
		this.logo.anchor.set(0.5);

		//create start button
		this.startButton = game.add.sprite(512/2, (288/2) + 10, 'startText');
		this.startButton.anchor.set(0.5);
		this.startButton.state = 'Beginning';

		//create credits button
		this.creditsButton = game.add.sprite(512/2, (288/2) + 50, 'creditsText');
		this.creditsButton.anchor.set(0.5);
		this.creditsButton.state = 'Credits';

		//create button selector for menu ui
		this.buttonSelector = new ButtonSelector(game, this.startButton, 'buttonSelector');
		this.buttonSelector.addSelection(this.creditsButton);

		//create music manager
		this.musicManager = new MusicManager();
        this.musicManager.playSong('main_menu');

        //allow button selector to be used
		this.buttonSelector.canNavigate = true;
	},

	shutdown:function()
	{
		//stop music on end of state
		this.musicManager.stop();
	}
}