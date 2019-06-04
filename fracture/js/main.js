//Variables
var game = new Phaser.Game(512, 288, Phaser.CANVAS);

game.state.add('Boot', Boot);
game.state.add('Play', Play);
game.state.add('MainMenu', MainMenu);
game.state.add('Credits', Credits);
game.state.start('Boot');