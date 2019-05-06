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

    direction;
    
    // references
    player;

    // flags
    planted = false;

    constructor(game, x, y, player, direction)
    {
        super(game, x, y, 'shard');
        game.add.world.add(this);

        this.direction = direction;
        this.player = player;

        // set up physics
        game.physics.p2.enable(this);
        this.body.setCollisionGroup(this.player.shardCollisionGroup);
        this.body.fixedRotation = true;
        
        // set to collide with tileset
        
        // configure hitbox shape
        //this.body.setRectangle(64, 16);
        
        // set anchor
        this.anchor.y = 0.5;
        
        // set rotation
        this.angle = direction;
        
        // set velocity
        this.body.velocity.x = Math.sin((direction + 90) * Math.PI / 180) * this.velocity;
        this.body.velocity.y = Math.cos((direction + 90) * Math.PI / 180) * this.velocity;
        
        this.body.collides(this.player.tilemapCollisionGroup);
        this.body.onBeginContact.add(this.onBeginContact, this);

        this.body.tag = 'shard';
        this.body.shard = this;
    }

    onBeginContact()
    {
        this.planted = true;
        this.body.dynamic = false;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        // set this to collide with player
        this.body.collides(this.player.collisionGroup);
    }
}