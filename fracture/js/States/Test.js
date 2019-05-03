var Test = {
    preload:function()
    {
        game.load.path = 'assets/img/';
        game.load.image('caretaker', 'Caretaker.png');
    },

    create:function()
    {
        game.add.sprite(100, 100, 'caretaker');
    },

    update:function()
    {

    }
}