class Pause extends Phaser.Sprite
{
	pause;
	pauseText;
	pauseButton;

	constructor(game, key)
	{
		super(game, 0, 0, 'pause');
		game.add.world.add(this);
		this.visible = false;
		this.alpha = 0.5;

		this.pause = game.add.text(game.world.centerX, game.world.centerY - 50, 'PAUSED', {fill : '#fff', align : 'center'});
		this.pause.anchor.set(0.5);
		this.pause.visible = false;

		this.pauseText = game.add.text(game.world.centerX, game.world.centerY + 25, 'RESUME', {fill : '#fff', align : 'center'});
		this.pauseText.anchor.set(0.5);
		this.pauseText.visible = false;
		this.pauseText.pause = true;

		this.pauseButton = game.input.keyboard.addKey(key);
		this.pauseButton.onDown.add(this.doPause, this);

		this.mainMenuText = game.add.text(game.world.centerX, game.world.centerY + 65, 'MAIN MENU', {fill : '#fff'});
		this.mainMenuText.anchor.set(0.5);
		this.mainMenuText.visible = false;
		this.mainMenuText.state = 'MainMenu';

		this.buttonSelector = new ButtonSelector(game, this.pauseText, 'buttonSelector');
		this.buttonSelector.addSelection(this.mainMenuText);
		this.buttonSelector.setVisible(false);
	}

	update()
	{
		if(game.paused) {
			this.visible = true;
			this.pause.visible = true;
			this.pauseText.visible = true;
			this.mainMenuText.visible = true;
			this.buttonSelector.setVisible(true);
			this.buttonSelector.canNavigate = true;
		} else {
			this.visible = false;
			this.pause.visible = false;
			this.pauseText.visible = false;
			this.mainMenuText.visible = false;
			this.buttonSelector.setVisible(false);
			this.buttonSelector.canNavigate = false;
		}
	}

	doPause()
	{
		game.paused = !game.paused;
		if(game.paused)
		{
			AudioManager.playPauseSound();
		}
		else
		{
			AudioManager.playResumeSound();
		}
	}

	doMenuButton()
	{
		if(game.paused) {
			game.state.start('MainMenu');
			game.paused = !game.paused;
		}
	}
}