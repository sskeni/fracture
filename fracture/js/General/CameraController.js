"use strict";

// manager for camera behavior
class CameraController
{   
    /*
    player;// a reference to the player
    camera;// a reference to the game's camera
    */

    constructor(player)
    {
        this.player = player;
        this.camera = game.camera;

        this.camera.follow(this.player);// follow the player
    }

    // when the player dies, the camera shouldn't follow them anymore
    die()
    {
        this.camera.unfollow();
    }

    // when the player respawns, the camera should revert to following the player
    respawn()
    {
        this.camera.follow(this.player);
    }


}