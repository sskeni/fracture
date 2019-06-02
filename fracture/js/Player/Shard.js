var ShardDirection = {
    MR: 0,
    BR: 45,
    BM: 90,
    BL: 135,
    ML: 180,
    UL: 225,
    UM: 270,
    UR: 315
}

class Shard extends Phaser.Sprite
{
    // behavior variables
    velocity = 500;// the velocity at which to fly
    launchDistance = 45;// the distance from the player under which we should launch the player when we plant ourselves

    hitboxWidth = 64;
    hitboxHeight = 15;

    direction;
    
    // references
    player;
    rectangle;// a rectangle for raycasting

    // flags
    planted = false;// whether this shard has planted itself in wall

    constructor(game, x, y, player, direction)
    {
        super(game, x, y, 'shard');
        game.add.world.add(this);

        this.direction = direction;
        this.player = player;
        // set up physics
        game.physics.p2.enable(this, false);
        
        // set to collide with tileset
        
        // configure hitbox shape
        
        // set anchor
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        
        // set rotation
        this.angle = direction;
        this.body.angle = direction;
        
        // set velocity
        this.body.velocity.x = Math.cos((direction) * Math.PI / 180) * this.velocity;
        this.body.velocity.y = Math.sin((direction) * Math.PI / 180) * this.velocity;
        
        // set position
        this.body.x += Math.cos((direction) * Math.PI / 180) * 20;
        this.body.y += Math.sin((direction) * Math.PI / 180) * 20;
        
        this.body.setRectangle(this.hitboxWidth, this.hitboxHeight);
        this.body.setCollisionGroup(this.player.shardCollisionGroup);
        this.body.collides(this.player.tilemapCollisionGroup);
        this.body.collides(this.player.shardCollisionGroup);
        this.body.onBeginContact.add(this.onBeginContact, this);
        
        this.body.fixedRotation = true;
        this.body.tag = 'shard';
        this.body.shard = this;

        this.tint = 0xff89e9;
    }

    isDiagonal()
    {
        return this.direction == ShardDirection.BR || this.direction == ShardDirection.BL 
        || this.direction == ShardDirection.UL || this.direction == ShardDirection.BR;
    }

    onBeginContact(bodyA, bodyB, myShape, theirShape, contactEquation)
    {
        if(bodyA.tag != 'player' && !this.planted)
        {

            this.planted = true;
            this.body.dynamic = false;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            
            // check distance to player
            //TODO this approach is naive: replace with check for if player origin is within certain bounds instead
            if(game.math.distance(this.body.x, this.body.y, this.player.body.x, this.player.body.y) < this.launchDistance)
            {
                this.player.stateManager.launch(this.direction);
            }
    
            // add a rectangle for raycasting based on the current position
            this.rectangle = Rectangle.createFromSprite(this, this.hitboxWidth, this.hitboxHeight);

            GamefeelMaster.shakeCamera(0.00002, 0, 100, 0.000001, 0, 0);

            // start colliding with the player on a delay to allow time for the player to be launched a bit
            game.time.events.add(Phaser.Timer.SECOND * 0.1, this.collidePlayer, this);

            // play sound
            this.player.audioManager.playShardImpact();
        }

        if(bodyA.tag == 'button')
        {
        	bodyA.hit = true;
        }
    }

    // set this shard to collide with player
    collidePlayer()
    {
        this.body.collides(this.player.collisionGroup);
    }
}