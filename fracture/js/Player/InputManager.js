class InputManager
{
    game;

    // keyboard controls
    directionKeys;
    jumpButton;
    shardButton;

    constructor(game)
    {
        this.game = game;
        this.directionKeys = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.shardButton = game.input.keyboard.addKey(Phaser.KeyCode.Z);
    }

    // returns a value in the range [-1, 1] representing the horizontal direction of player input
    getHorizontalInput()
    {
        var inputValue = 0;

        if(this.directionKeys.left.isDown)
        {
            inputValue -= 1;
        }
        
        if(this.directionKeys.right.isDown)
        {
            inputValue += 1;
        }

        return inputValue;
    }

    jumpButtonIsDown()
    {
        return this.jumpButton.isDown;
    }
    
    shardButtonIsDown()
    {
        return this.shardButton.isDown;
    }
}