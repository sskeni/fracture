"use strict";

// manages pause behavior, including the pause menu
class Pause
{
	backKey;// a phaser key that closes the pause menu
	pauseKey;// a phaser key that closes the pause menu

	pauseBorder;// a sprite for the border around the pause menu
	pause;// a sprite for the pause text
	resumeText;// a sprite for the resume game button
	mainMenuText;// a sprite for the main menu button
	
	buttonSelector;// a reference to the button selector for this pause menu

	constructor(game, key)
	{
		this.pauseBorder = game.add.sprite(512/2, (288/2), 'pauseBorder');
		this.pauseBorder.anchor.set(0.5);
		this.pauseBorder.visible = false;
		this.pauseBorder.fixedToCamera = true;

		this.pause = game.add.sprite(512/2, (288/2) - 50, 'pauseText');
		this.pause.anchor.set(0.5);
		this.pause.visible = false;
		this.pause.fixedToCamera = true;


		this.resumeText = game.add.sprite(512/2, (288/2) + 25, 'resumeText');
		this.resumeText.anchor.set(0.5);
		this.resumeText.visible = false;
		this.resumeText.pause = true;
		this.resumeText.fixedToCamera = true;


		this.pauseKey = game.input.keyboard.addKey(key);
		this.pauseKey.onDown.add(this.doPause, this);
		this.pauseKey.fixedToCamera = true;


		this.mainMenuText = game.add.sprite(512/2, (288/2) + 65, 'mainMenuText');
		this.mainMenuText.anchor.set(0.5);
		this.mainMenuText.visible = false;
		this.mainMenuText.state = 'MainMenu';
		this.mainMenuText.fixedToCamera = true;


		this.buttonSelector = new ButtonSelector(game, this.resumeText, 'buttonSelector');
		this.buttonSelector.addSelection(this.mainMenuText);
		this.buttonSelector.setVisible(false);

		this.backKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
	}

	update()
	{
		if(game.paused)// when the game is paused
		{
			// make all pause ui visible
			this.pause.visible = true;
			this.resumeText.visible = true;
			this.mainMenuText.visible = true;
			this.buttonSelector.setVisible(true);
			this.buttonSelector.canNavigate = true;
			this.pauseBorder.visible = true;

			if(this.backKey.isDown)// if the back key has been pressed, close the pause menu
			{
				this.doPause();
			}
		} 
		else 
		{
			// make all pause ui invisable
			this.visible = false;
			this.pause.visible = false;
			this.resumeText.visible = false;
			this.mainMenuText.visible = false;
			this.buttonSelector.setVisible(false);
			this.buttonSelector.canNavigate = false;
			this.pauseBorder.visible = false;
		}
	}

	// toggle the pause state of the game
	doPause()
	{
		game.paused = !game.paused;
		if(game.paused)// if after toggling the game is paused
		{
			this.bringToTop();// bring all elements to the top of the render que
			AudioManager.playPauseSound();// play the pause sound
			this.buttonSelector.updatePosition();// make sure the buttonSelector's icons are positioned correctly

			game.time.slowMotion = 1;// reset slow motion in case we're in hitstun
		}
		else
		{
			AudioManager.playResumeSound();// play the resume sound
		}
	}

	// brings all pause ui to the top of the render que
	bringToTop()
	{
		this.pauseBorder.bringToTop();
		this.pause.bringToTop();
		this.resumeText.bringToTop();
		this.mainMenuText.bringToTop();
		this.buttonSelector.bringToTop();
	}

	// returns the game to the main menu state
	doMenuButton()
	{
		if(game.paused) {
			game.state.start('MainMenu');
		}
	}
}