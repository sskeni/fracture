var Play = {
    preload:function()
    {
        game.load.path = 'assets/img/';

        //pause assets
        game.load.image('pause', 'pause.png');
        game.load.image('pauseBorder', 'pauseBorder.png');

        Player.load();
        TutorialManager.load();
        AudioManager.load();
        AudioManager.loadUI();
        TilemapManager.load();
        MusicManager.loadLevels();
    },

    create:function()
    {
        //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        
        this.player = new Player(game, 0, 0);

        
        this.tilemapManager = new TilemapManager(this.player, 'Jake1');
        //this.tilemapManager = new TilemapManager(this.player, 'level1');
        this.tilemapManager.addLevel('Ariana2');
        this.tilemapManager.addLevel('Ariana3');
        this.tilemapManager.addLevel('Sanchit1');
        this.tilemapManager.addLevel('Sanchit2');
        
        this.player.addTilemapManager(this.tilemapManager);
        
        this.pause = new Pause(game, Phaser.Keyboard.P);
        
        this.musicManager = new MusicManager();
        this.musicManager.playSong('track_2');

        this.tutorialManager = new TutorialManager(this.player);
    },

    update:function()
    {
        this.tilemapManager.update();
        this.tutorialManager.update();
    },

    render:function()
    {
        this.pause.update();
    },

    //move each platform to account for anchor
    changeBody:function(platform)
    {
        platform.body.x = platform.x+platform.width/2;
        platform.body.y = platform.y+platform.height/2;
        platform.angle = platform.body.angle;
    },

    shutdown:function()
    {
        this.musicManager.stop();
    }
}