/***
 * Fracture
 * Team TNT
 * 5/13/2019
 * Jake Burick, Ariana Riccio, Sanchit Keni
 * 
 * GitHub Repository: https://github.com/sskeni/fracture
 * 
 */


//Variables
var game = new Phaser.Game(512, 288, Phaser.CANVAS);

game.state.add('Boot', Boot);
game.state.add('Gameplay', Gameplay);
game.state.add('MainMenu', MainMenu);
game.state.start('Boot');