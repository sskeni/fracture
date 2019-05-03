//Variables
var game = new Phaser.Game(512, 288, Phaser.CANVAS);


console.log(game);
console.log(game.scale);
console.log(game);

game.state.add('Boot', Boot);
game.state.add('Test', Test);
game.state.start('Boot');