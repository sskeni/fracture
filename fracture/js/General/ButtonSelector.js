"use strict";

// manages visuals and functionality for menu selection through the arrow keys
class ButtonSelector
{
	/*
	currentSelection;// the currently selected button; holds information about what action to take when it is selected
	selections;// an array of all selections offered by this button manager
	selectionNum;// the index of the current selection in selections
	icon1;// the left heart icon denoting which button is selected
	icon2;// the right heart icon denoting which button is selected
	downKey;// the phaser key that moves selection down by one
	upKey;// the phaser key that moves selection up by one
	selectKey;// the phaser key that confirms a selection
	canNavigate;// whether the button selector is currently active and taking input
	*/

	constructor(game, initialSelection, key)
	{
		// populate the first element of selections
		this.selections = new Array();
		this.addSelection(initialSelection);
		this.selectionNum = 0;
		this.currentSelection = this.selections[this.selectionNum];

		// create icons to show where the current selection is
		this.icon1 = game.add.sprite(0, 0, key);
		this.icon1.anchor.set(0.5);
		this.icon2 = game.add.sprite(0, 0, key);
		this.icon2.anchor.set(0.5);

		// create navigation keys
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.selectKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

		// setup key events
		this.downKey.onDown.add(this.moveDown, this);
		this.upKey.onDown.add(this.moveUp, this);
		this.selectKey.onDown.add(this.executeSelection, this);

		// start inactive and set the selection icons to the correct positions
		this.canNavigate = false;
		this.updatePosition();
	}

	// moves selection down by one
	moveDown()
	{	
		if(this.canNavigate)// if the selector is active
		{
			if(this.currentSelection != this.selections[this.selections.length-1])// and we haven't reached the last selection yet
			{
				// change the selection
				AudioManager.playSwapSound();
				this.currentSelection = this.selections[++this.selectionNum];
				this.updatePosition();
			}
		}
		
	}

	moveUp()
	{
		if(this.canNavigate)// if the selector is active
		{
			if(this.currentSelection != this.selections[0])
			{
				AudioManager.playSwapSound();
				this.currentSelection = this.selections[--this.selectionNum];
				this.updatePosition();
			}
		}
	}

	addSelection(selection) {
		this.selections.push(selection);
	}

	executeSelection()
	{
		if(this.canNavigate)
		{
			if('state' in this.currentSelection)
			{
				AudioManager.playSound('select', 0.5);
				if(this.currentSelection.state == "MainMenu")
				{
					if(game.state.getCurrentState().musicManager != null)
					{
						game.state.getCurrentState().musicManager.stop();
					}
						
				}
				
				game.state.start(this.currentSelection.state);
				if(game.paused) game.paused = false;

				if(this.currentSelection.state == "Play")
				{
					AudioManager.playSound('start_game', 0.5);	
				}
			}
			if('pause' in this.currentSelection) 
			{
				AudioManager.playResumeSound();
				game.paused = false;
			}
		}
	}

	bringToTop()
	{
		this.icon1.bringToTop();
		this.icon2.bringToTop();
	}
	
	updatePosition()
	{
		this.icon1.x = this.currentSelection.x - this.currentSelection.width/2 - 15;
		this.icon1.y = this.currentSelection.y;

		this.icon2.x = this.currentSelection.x + this.currentSelection.width/2 + 15;
		this.icon2.y = this.currentSelection.y;
	}

	setVisible(condition)
	{
		this.icon1.visible = condition;
		this.icon2.visible = condition;
	}
}