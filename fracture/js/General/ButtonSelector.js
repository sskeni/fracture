class ButtonSelector
{
	currentSelection;
	selectionNum;
	selections;
	icon1;
	icon2;
	downKey;
	upKey;
	canNavigate;

	constructor(game, initialSelection, key)
	{
		this.selections = new Array();
		this.addSelection(initialSelection);

		this.selectionNum = 0;
		this.currentSelection = this.selections[this.selectionNum];

		this.icon1 = game.add.sprite(0, 0, key);
		this.icon1.anchor.set(0.5);
		this.icon2 = game.add.sprite(0, 0, key);
		this.icon2.anchor.set(0.5);

		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.selectKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

		this.downKey.onDown.add(this.moveDown, this);
		this.upKey.onDown.add(this.moveUp, this);
		this.selectKey.onDown.add(this.executeSelection, this);

		this.canNavigate = false;
		this.updatePosition();
	}

	moveDown()
	{	
		if(this.canNavigate) 
		{
			if(this.downKey.justDown)
			{
				AudioManager.playSound('swap_selection', 0.5);
				if(this.currentSelection != this.selections[this.selections.length-1])
				{
					this.currentSelection = this.selections[++this.selectionNum];
				}
			}
			this.updatePosition();
		}
		
	}

	moveUp()
	{
		if(this.canNavigate)
		{
			if(this.upKey.justDown)
			{
				AudioManager.playSound('swap_selection', 0.5);
				if(this.currentSelection != this.selections[0])
				{
					this.currentSelection = this.selections[--this.selectionNum];
				}
			}
			this.updatePosition();
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
					game.state.getCurrentState().musicManager.stop();
				}
				
				game.state.start(this.currentSelection.state);
				if(game.paused) game.paused = false;

				if(this.currentSelection.state == "Play")
				{
					AudioManager.playSound('start_game', 0.5);	
				}
			}
			if('pause' in this.currentSelection) game.paused = false;
		}
	}
	
	updatePosition()
	{
		this.icon1.x = this.currentSelection.x - this.currentSelection.width/2 - 15;
		this.icon1.y = this.currentSelection.y - 4;

		this.icon2.x = this.currentSelection.x + this.currentSelection.width/2 + 15;
		this.icon2.y = this.currentSelection.y - 4;
	}

	setVisible(condition)
	{
		this.icon1.visible = condition;
		this.icon2.visible = condition;
	}
}