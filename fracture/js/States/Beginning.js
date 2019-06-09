var Beginning = {
	preload:function()
	{
		game.load.path = 'assets/img';

		game.load.path = 'js/Levels/';

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
        

        this.player = new Player(game, 0, 0);

        this.tilemapManager = new TilemapManager(this.player, 'beginning');
		this.tilemapManager.startdoors.setAll('alpha', 0);
		
        this.player.addTilemapManager(this.tilemapManager);

        this.flowerManager = new FlowerManager(this.player);
        this.flowerManager.playAnimation();

		//this.player.playBeginningCutscene();
		this.player.inputManager.disable();
		
	},

	update:function()
	{
		if(this.tutorialManager != null) this.tutorialManager.update();
		this.tilemapManager.update(); 
		if(this.player.body.x > 480 && !this.player.dead)
		{
			this.player.inputManager.disable();
			this.flowerManager.startBlackout();
		}
	},

	createTutorialManager()
	{
		this.tutorialManager = new TutorialManager(this.player, 1);
	}
}