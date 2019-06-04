var Credits = {

	preload:function()
	{
		game.load.path = 'assets/img/';
	},

	create:function()
	{
		logo = game.add.sprite(game.world.centerX, 30, 'logo');
		logo.anchor.set(0.5);

		backButton = game.add.text(game.world.centerX, game.world.centerY + 120, 'BACK', {fill: '#fff'});
		backButton.anchor.set(0.5);
		backButton.state = 'MainMenu';

		names = game.add.text(game.world.centerX, game.world.centerY - 75, 'Jake Burdick - Sanchit Keni - Ariana Riccio', {font: '20px', fill: '#fff', align: 'center'});
		names.anchor.set(0.5);

		var soundsText = "Clinking Glasses - redafs: https://freesound.org/people/redafs/sounds/379506/\nCrystal bowl hit F3 1 - caiogracco: https://freesound.org/people/caiogracco/sounds/150453/\nClinking Glass - redjim: https://freesound.org/people/redjim/sounds/32582/\nGlass Remnants 01 - Black Snow: https://freesound.org/people/Black%20Snow/sounds/145560/\nBottle Shattering - spookymodem: https://freesound.org/people/spookymodem/sounds/202093/\nbreaking_a_bottle_no1 - Connum: https://freesound.org/people/Connum/sounds/66519/\nGlass of crystal - PappaBert: https://freesound.org/people/PappaBert/sounds/417981/\nwine glass falls - FreqMan: https://freesound.org/people/FreqMan/sounds/42908/\nGate Latch - mhtaylor67: https://freesound.org/people/mhtaylor67/sounds/126041/\nClock Wind - adeluc4: https://freesound.org/people/adeluc4/sounds/125320/\nClockWinding - acclivity: https://freesound.org/people/acclivity/sounds/13713/"
		sounds = game.add.text(game.world.centerX, game.world.centerY + 20, soundsText, {font: "12px", fill: '#fff', align: 'center'});
		sounds.anchor.set(0.5);
		sounds.lineSpacing = -8;

		this.buttonSelector = new ButtonSelector(game, backButton, 'buttonSelector');
	},

	update:function()
	{
		this.buttonSelector.update();
	}
}