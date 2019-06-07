class InputManager
{
    game;

    disabled = false;

    // keyboard controls
    directionKeys;
    jumpButton;
    shardButton;
    resetButton;

    // justDown by frame
    shardJustDown;
    jumpJustDown;
    resetJustDown;

    constructor(game)
    {
        this.game = game;
        this.directionKeys = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.shardButton = game.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.resetButton = game.input.keyboard.addKey(Phaser.KeyCode.R);
    }

    update()
    {
        this.shardJustDown = this.shardButton.justDown;
        this.jumpJustDown = this.jumpButton.justDown;
        this.resetJustDown = this.resetButton.justDown;
    }

    disable()
    {
        this.disabled = true;
    }
    
    enable()
    {
        this.disabled = false;
    }

    // returns a value in the range [-1, 1] representing the horizontal direction of player input
    getHorizontalInput()
    {
        if(this.disabled)
        {
            return 0;
        }

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
        if(this.disabled)
        {
            return 0;
        }

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
        if(this.disabled)
        {
            return 0;
        }
        
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
        return this.jumpButton.isDown && !this.disabled;
    }

    jumpButtonJustDown()
    {
        return this.jumpJustDown && !this.disabled;
    }
    
    shardButtonIsDown()
    {
        return this.shardButton.isDown && !this.disabled;
    }

    shardButtonJustDown()
    {
        return this.shardJustDown && !this.disabled;
    }

    resetButtonJustDown()
    {
        return this.resetJustDown && !this.disabled;
    }
}