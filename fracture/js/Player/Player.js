class Player extends Phaser.Sprite
{
    // behavior values
    shardCount = 3;// the number of shards the player can fire
    shardLaunchVelocity = 500;// the velocity at which the player is launched when a shard grows right next to them
    raycastRadius = 150;// the radius under which tiles are raycasted. Ensures that tiles we're guaranteed not to hit are not tested 
    groundRaycastDistance = 20;// the distance to raycast for ground tiles
    groundRaycastWidth = 10;// the horizontal offset to the left and right that raycasts for ground should be made at
    respawnTime = 1;// the length of time it takes to respawn in seconds

    // references
    inputManager;
    stateManager;
    tilemapManager;
    collisionGroup;
    tilemapCollisionGroup;
    shardCollisionGroup;
    raycastTargets;
    shards;
    animationController;
    audioManager;
    shardCounter;

    spawnPoint;

    // flags
    launched;
    standingOnShard;
    dead;
    justReset;

    constructor(game, x, y, key) 
    {
        // properly inherit Phaser.Sprite
        super(game, x, y, 'player');
        game.add.world.add(this);

        var color = 0xff89e9;
        this.tint = color;
        
        // set anchor to be the center of the sprite
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        
        // set up input
        this.inputManager = new InputManager(game);
        
        // set up state manager
        this.stateManager = new PlayerStateManager(this);

        this.raycastTargets = new Array();
        this.shards = new Array();

        // set up animation controller
        this.animationController = new PlayerAnimationController(this);

        // set up audio manager
        this.audioManager = new PlayerAudioManager(this);

        // set up camera controller
        this.cameraController = new CameraController(this);

        // set up shard counter
        this.shardCounter = new ShardCounter();

        // set up physics
        game.physics.p2.enable(this, false);
        this.body.setCircle(15);
        this.collisionGroup = game.physics.p2.createCollisionGroup();
        this.body.setCollisionGroup(this.collisionGroup);
        this.shardCollisionGroup = game.physics.p2.createCollisionGroup();
        this.body.collides(this.shardCollisionGroup);
        this.body.tag = 'player';

        this.body.fixedRotation = true;

        // set flags
        this.launched = false;
        this.standingOnShard = false;
        this.dead = false;

        this.spawnPoint = new Vector(x, y);
    }

    // loads all assets used by the player
    static load()
    {
        var path = game.load.path;
        game.load.path = 'assets/img/';
        game.load.image('cursorBase', 'cursorBase.png');
        game.load.image('cursorTip', 'cursorTip.png');
        game.load.image('shard', 'Shard.png');
        PlayerAnimationController.load();
        PlayerAudioManager.load();
        ShardCounter.load();
        game.load.path = path;
    }

    update()
    {
        if(!this.dead)
        {
            this.alpha = 1;// workaround for bug with alpha tweening
            this.stateManager.update();
            this.inputManager.update();
        }
    }

    setTilemapCollisionGroup(tilemapCollisionGroup)
    {
        this.tilemapCollisionGroup = tilemapCollisionGroup;
        this.body.collides(this.tilemapCollisionGroup);
    }

    addTilemapManager(tilemapManager)
    {
        this.tilemapManager = tilemapManager;
    }

    fireShard(direction)
    {
        if(this.shardCount > 0)
        {
            var shard = new Shard(game, this.body.x, this.body.y, this, direction);
            this.shards.push(shard);
            this.shardCount -= 1;

            // play firing sound
            this.audioManager.playFireShard();

            // update the counter
            this.shardCounter.fireShard();

            // shake the camera
            GamefeelMaster.shakeCamera(0.00002, 0, 100, 0.000001, 100, 100);
        }
    }

    // returns whether the player should behave like they are on the ground
    onGround()
    {
        var position = new Vector(this.body.x, this.body.y);
        var direction = new Vector(0, this.groundRaycastDistance);
        var leftPosition = new Vector(this.body.x - this.groundRaycastWidth, this.body.y);
        var rightPosition = new Vector(this.body.x + this.groundRaycastWidth, this.body.y);
        // raycast down for floor tiles
        for(var index in this.raycastTargets)
        {
            var target = this.raycastTargets[index];

            if(target.y > this.y && position.distance(new Vector(target.x, target.y)) < this.raycastRadius)
            {
                if(Raycast.raycastToRectangle(target.rectangle, leftPosition, direction) != false)
                {
                    if(target.tag == 'spike') this.die();
                    return true;
                }
                if(Raycast.raycastToRectangle(target.rectangle, rightPosition, direction) != false)
                {
                    if(target.tag == 'spike') this.die();
                    return true;
                }
            }
        }
        return false;
    }


    startLevel(x, y)
    {
        this.bringToTop();
        this.shardCounter.bringToTop();
        this.spawnPoint = new Vector(x, y);
        this.respawn();
    }

    respawn()
    {
        this.body.x = this.spawnPoint.x;
        this.body.y = this.spawnPoint.y;

        // set flags
        this.launched = false;
        this.standingOnShard = false;
        this.dead = false;
        this.justReset = true;

        this.cameraController.respawn();
        this.animationController.animateRespawn();

        this.clearShards();
        this.shardCounter.reset();

        game.time.events.add(0.1 * Phaser.Timer.SECOND, function() {this.justReset = false;}, this);
    }

    clearShards()
    {
        for(var shard of this.shards)
        {
            shard.destroy();
        }
        this.shardCount = 3;
        this.shards = new Array();
    }

    // returns whether the player should behave like they are on a shard
    onShard()
    {
        var position = new Vector(this.body.x, this.body.y);
        var direction = new Vector(0, this.groundRaycastDistance);
        var leftPosition = new Vector(this.body.x - this.groundRaycastWidth, this.body.y);
        var rightPosition = new Vector(this.body.x + this.groundRaycastWidth, this.body.y);

        if(this.shards.length == 0)
        {
            return false;
        }

        for(var shard of this.shards)
        {
            if(shard.planted == true)
            {
                if(shard.isDiagonal())// if the shard isn't vertical
                {
                    direction = new Vector(0, this.groundRaycastDistance - 5);// don't raycast as far
                }

                if(Raycast.raycastToRectangle(shard.rectangle, position, direction) != false)
                {
                    return shard;
                }
                if(Raycast.raycastToRectangle(shard.rectangle, leftPosition, direction) != false)
                {
                    return shard;
                }
                if(Raycast.raycastToRectangle(shard.rectangle, rightPosition, direction) != false)
                {
                    return shard;
                }
            }
        }

        return false;
    }


    // returns the distance to the closest object below the player
    distanceToGround()
    {
        var position = new Vector(this.body.x, this.body.y);
        var direction = new Vector(0, 1000);
        var minDistance = 1000;

        // raycast down for floor tiles
        for(var target of this.raycastTargets)
        {
            if(target.y > this.body.y)
            {
                var hitLocation = Raycast.raycastToRectangle(target.rectangle, position, direction);
                if(hitLocation != false)
                {
                    var distance = position.distance(hitLocation);
                    if(minDistance > distance)
                    {
                        minDistance = distance;
                    }
                }
            }
        }
        for(var shard of this.shards)
        {
            if(shard.planted)
            {
                var hitLocation = Raycast.raycastToRectangle(shard.rectangle, position, direction);
                if(hitLocation != false)
                {
                    var distance = position.distance(hitLocation);
                    if(minDistance > distance)
                    {
                        minDistance = distance;
                    }
                }
            }
        }

        return minDistance;
    }


    addRaycastTarget(target)
    {
        if('rectangle' in target)
        {
            this.raycastTargets.push(target);
        }
        else
        {
            console.error("Error - object cannot be added to raycastTargets because it does not have a rectangle property");
        }
    }

    removeRaycastTarget(target)
    {
        if('rectangle' in target)
        {
            for(var elem of this.raycastTargets) {
                if(elem == target) {
                    this.raycastTargets.splice(elem);
                }
            }
        }
        else
        {
            console.error("Error - object cannot be removed from raycastTargets because it does not have a rectangle property");
        }
    }

    // restart the level after playing an animation
    die()
    {
        GamefeelMaster.shakeCamera(0.00004, 0, 100, 0.000001, 0, 0);
        this.audioManager.playSound('shatter', 0.3);
        AudioManager.playSound('begin_level', 0.7);
        this.animationController.animateDeath();
        this.cameraController.die();
        this.dead = true;
        this.tilemapManager.resetLevel();

        game.time.events.add(this.respawnTime * Phaser.Timer.SECOND, this.respawn, this);
    }

    playEndingCutscene()
    {
        this.dead = true;// stop doing things
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.animations.play('ending');
    }
}