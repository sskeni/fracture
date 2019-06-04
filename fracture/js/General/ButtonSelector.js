class ButtonSelector
{
	currentSelection;
	selectionNum;
	selections;
	icon1;
	icon2;
	downKey;
	upKey;

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
	}

	addSelection(selection) {
		this.selections.push(selection);
	}

	update()
	{
		this.updatePosition();
		if(this.downKey.justDown)
		{
			if(this.currentSelection != this.selections[this.selections.length-1])
			{
				this.currentSelection = this.selections[++this.selectionNum];
			}
		}
		if(this.upKey.justDown)
		{
			if(this.currentSelection != this.selections[0])
			{
				this.currentSelection = this.selections[--this.selectionNum];
			}
		}
		if(this.selectKey.justDown)
		{
			this.executeSelection();
		}
	}

	executeSelection()
	{
		if('state' in this.currentSelection)
		{
			game.state.start(this.currentSelection.state);
		}
	}

	updatePosition()
	{
		this.icon1.x = this.currentSelection.x - this.currentSelection.width/2 - 15;
		this.icon1.y = this.currentSelection.y - 4;

		this.icon2.x = this.currentSelection.x + this.currentSelection.width/2 + 15;
		this.icon2.y = this.currentSelection.y - 4;
	}
}