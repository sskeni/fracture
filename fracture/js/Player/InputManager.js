class InputManager
{
    game;

    // keyboard controls
    directionKeys;
    jumpButton;
    shardButton;

    // justDown by frame
    shardJustDown;
    jumpJustDown;

    constructor(game)
    {
        this.game = game;
        this.directionKeys = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.shardButton = game.input.keyboard.addKey(Phaser.KeyCode.Z);
    }

    update()
    {
        this.shardJustDown = this.shardButton.justDown;
        this.jumpJustDown = this.jumpButton.justDown;
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

    // returns a value in the range [-1, 1] representing the vertical direction of player input
    getVerticalInput()
    {
        var inputValue = 0;

        if(this.directionKeys.up.isDown)
        {
            inputValue -= 1;
        }
        
        if(this.directionKeys.down.isDown)
        {
            inputValue += 1;
        }

        return inputValue;
    }

    // returns a ShardDirection representation of the player's input direction
    getInputAsShardDirection()
    {
        var horizontalInput = this.getHorizontalInput()
        if(this.directionKeys.up.isDown)
        {
            if(horizontalInput > 0)
            {
                return ShardDirection.UR;
            }
            else if(horizontalInput < 0)
            {
                return ShardDirection.UL;
            }
            else
            {
                return ShardDirection.UM;
            }
        }
        else if(this.directionKeys.down.isDown)
        {
            if(horizontalInput > 0)
            {
                return ShardDirection.BR;
            }
            else if(horizontalInput < 0)
            {
                return ShardDirection.BL;
            }
            else
            {
                return ShardDirection.BM;
            }
        }
        else
        {
            if(horizontalInput > 0)
            {
                return ShardDirection.MR;
            }
            else if(horizontalInput < 0)
            {
                return ShardDirection.ML;
            }
            else
            {
                return ShardDirection.BM;
            }
        }
    }

    jumpButtonIsDown()
    {
        return this.jumpButton.isDown;
    }

    jumpButtonJustDown()
    {
        return this.jumpJustDown;
    }
    
    shardButtonIsDown()
    {
        return this.shardButton.isDown;
    }

    shardButtonJustDown()
    {
        return this.shardJustDown;
    }
}