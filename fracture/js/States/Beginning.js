var Beginning = {
	preload:function()
	{
		game.load.path = 'assets/img';

		game.load.path = 'js/Levels/';

		Player.load();
		FlowerManager.load();
        TilemapManager.load();
	},

	create:function()
	{
		//set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        

        this.player = new Player(game, 0, 0);

        this.tilemapManager = new TilemapManager(this.player, 'beginning');
        this.tilemapManager.startdoors.setAll('alpha', 0);

        this.flowerManager = new FlowerManager();
        this.flowerManager.playAnimation();

        this.player.playBeginningCutscene();
	},

	update:function()
	{
		this.tilemapManager.update();
		if(this.player.body.x > 480)
		{
			this.player.playBeginningCutscene();
			this.flowerManager.startWhiteout();
		}
	}
}