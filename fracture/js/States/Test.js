var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');
    },

    create:function()
    {
        game.physics.startSystem(Phaser.Physics.P2JS);
        this.player = new Player(game, 100, 200, 'caretaker');
    },

    update:function()
    {
        this.player.update();
    }
}