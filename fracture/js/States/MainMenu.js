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
		
		AudioManager.loadUI();
		MusicManager.loadMainMenu();
	},

	create:function()
	{
		game.stage.backgroundColor = '#000';

		background = game.add.sprite(game.world.width, game.world.height, 'background');
		background.anchor.set(1);

		logo = game.add.sprite(game.world.centerX, game.world.centerY - 60, 'logo');
		logo.anchor.set(0.5);

		startButton = game.add.sprite(game.world.centerX, game.world.centerY + 10, 'startText');
		startButton.anchor.set(0.5);
		startButton.state = 'Play';

		creditsButton = game.add.sprite(game.world.centerX, game.world.centerY + 50, 'creditsText');
		creditsButton.anchor.set(0.5);
		creditsButton.state = 'Credits';

		this.buttonSelector = new ButtonSelector(game, startButton, 'buttonSelector');
		this.buttonSelector.addSelection(creditsButton);

		this.musicManager = new MusicManager();
        this.musicManager.playSong('main_menu');
		this.buttonSelector.canNavigate = true;
	},

	shutdown:function()
	{
		this.musicManager.stop();
	}
}