class Pause extends Phaser.Sprite
{
	pauseText;
	pauseButton;

	constructor(game, key)
	{
		super(game, 0, 0, 'pause');
		game.add.world.add(this);
		this.visible = false;
		this.alpha = 0.5;

		this.pauseText = game.add.text(game.world.centerX, game.world.centerY, 'PAUSED', {fill : '#fff'});
		this.pauseText.anchor.set(0.5);
		this.pauseText.visible = false;

		this.pauseButton = game.input.keyboard.addKey(key);

		this.pauseButton.onDown.add(this.doPause, this);
	}

	doPause() {
		game.paused = !game.paused;
		if(game.paused) {
			this.visible = true;
			this.pauseText.visible = true;
		} else {
			this.visible = false;
			this.pauseText.visible = false;
		}
	}
}