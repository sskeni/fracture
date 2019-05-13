var ShardDirection = {
    MR: 0,
    UR: 45,
    UM: 90,
    UL: 135,
    ML: 180,
    BL: 225,
    BM: 270,
    BR: 315
}

class Shard extends Phaser.Sprite
{
    // behavior variables
    velocity = 500;
    launchDistance = 45;

    hitboxWidth = 64;
    hitboxHeight = 15;

    direction;
    
    // references
    player;
    rectangle;

    // flags
    planted = false;

    constructor(game, x, y, player, direction)
    {
        super(game, x, y, 'shard');
        game.add.world.add(this);

        this.direction = direction;
        this.player = player;
        // set up physics
        game.physics.p2.enable(this, true);
        
        // set to collide with tileset
        
        // configure hitbox shape
        
        // set anchor
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        
        // set rotation
        console.log(direction);
        this.angle = -direction;
        this.body.angle = -direction;
        
        // set velocity
        this.body.velocity.x = Math.sin((direction + 90) * Math.PI / 180) * this.velocity;
        this.body.velocity.y = Math.cos((direction + 90) * Math.PI / 180) * this.velocity;
        
        // set position
        this.body.x += Math.sin((direction + 90) * Math.PI / 180) * 20;
        this.body.y += Math.cos((direction + 90) * Math.PI / 180) * 20;
        
        this.body.setRectangle(this.hitboxWidth, this.hitboxHeight);
        this.body.setCollisionGroup(this.player.shardCollisionGroup);
        this.body.collides(this.player.tilemapCollisionGroup);
        this.body.onBeginContact.add(this.onBeginContact, this);
        
        this.body.fixedRotation = true;
        this.body.tag = 'shard';
        this.body.shard = this;

        //this.rectangle = Rectangle.createFromSprite(this, this.hitboxWidth, this.hitboxHeight);
    }

    onBeginContact(abstractContactedBody, contactedBody, myShape, theirShape, contactEquation)
    {
        if(abstractContactedBody.tag != 'player')
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
    
            this.rectangle = Rectangle.createFromSprite(this, this.hitboxWidth, this.hitboxHeight);
            console.log(this.rectangle);
            this.player.addRaycastTarget(this);

            game.time.events.add(Phaser.Timer.SECOND * 0.1, this.collidePlayer, this)
        }
    }

    // set this shard to collide with player
    collidePlayer()
    {
        this.body.collides(this.player.collisionGroup);
    }
}