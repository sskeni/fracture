class CameraController
{   
    player;
    camera;


    constructor(player)
    {
        this.player = player;
        this.camera = game.camera;

        this.camera.follow(this.player);
    }

    die()
    {
        this.camera.unfollow();
    }

    respawn()
    {
        this.camera.follow(this.player);
    }


}