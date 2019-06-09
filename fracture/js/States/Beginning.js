"use strict";

//state for beginning cutscene
var Beginning = {
	preload:function()
	{
		//load neccesary assets
		Player.load();
		FlowerManager.load();
		TilemapManager.load();
		TutorialManager.load();
		AudioManager.loadBeginning();
	},

	create:function()
	{
		//set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        
        //create player
        this.player = new Player(game, 0, 0);

        //load tileset for cutscene level
        this.tilemapManager = new TilemapManager(this.player, 'beginning');

        //make startdoor invisible
		this.tilemapManager.startdoors.setAll('alpha', 0);
		
		//add the tilemapManager to the player so they can interact
        this.player.addTilemapManager(this.tilemapManager);

        //create flower
        this.flowerManager = new FlowerManager(this.player);
        this.flowerManager.playAnimation();

		//disable inputs for player during cutscene
		this.player.inputManager.disable();
		
	},

	update:function()
	{
		//update tutorial manager
		if(this.tutorialManager != null) this.tutorialManager.update();

		//update tilemap manager
		this.tilemapManager.update(); 

		//check if player has reached threshold to transition to next state
		if(this.player.body.x > 480 && !this.player.dead)
		{
			this.player.inputManager.disable();
			this.flowerManager.startBlackout();
		}
	},

	//used to show controls when cutscene is over
	createTutorialManager()
	{
		this.tutorialManager = new TutorialManager(this.player, 1);
	}
}