var Boot = {
    preload:function()
    {
        //scale method from this tutorial: https://www.davideaversa.it/2016/06/quick-dev-tips-pixel-perfect-scaling-phaser-game/
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setUserScale(3, 3);
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);


        game.state.start('MainMenu');
        //game.state.start('Ending');
    }
}