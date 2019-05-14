var MainMenu = {
    preload:function()
    {
        
    },

    create:function()
    {
        // background color
        game.stage.backgroundColor = '#87ceeb';

        // tutorial text
        game.add.text(game.world.centerX - 200, 20, "Fracture");
        game.add.text(game.world.centerX - 180, 70, "Arrow Keys to Move, Z to Fire Shard, X to Jump", { font: '16px helvetica'});
        game.add.text(game.world.centerX -180, 120, "Press Space to Begin", { font: '16px helvetica'});
        game.add.text();

        // set up a key
        this.space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    },

    update:function()
    {
        if(this.space.isDown)
        {
            game.state.start('Gameplay');// start the game
        }
    }
}