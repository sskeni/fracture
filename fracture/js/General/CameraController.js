class CameraController
{   
    player;
    camera;


    constructor(player)
    {
        this.player = player;
        this.camera = game.camera;

        console.log("hey");

        this.camera.follow(this.player);
    }

    die()
    {
        this.camera.unfollow();
    }


}