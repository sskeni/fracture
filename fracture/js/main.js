//Variables
var game = new Phaser.Game(512, 288, Phaser.CANVAS);

game.state.add('Boot', Boot);
game.state.add('Test', Test);
game.state.start('Boot');