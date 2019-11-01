"use strict";

// helper class for all things game-feel
class GamefeelMaster
{
    //static cameraShakeResolution = 100;// with what frequency the camera shake adjusts intensity


    constructor(player)
    {
        this.cameraShakeResolution = 100
        this.player = player;
        this.camera = game.camera;

        this.camera.follow(this.player);// follow the player
    }

    // shakes the camera with the given envelope
    // intensity: the maximum camera shake intensity
    // attack: the time it takes to reach max intensity
    // decay: the amount of time it takes to reach the sustained intensity
    // sustain: the intensity of the sustained shake
    // sustainLength: the time spent at the sustain value
    // release: the amount of time it takes to reach no shake after the sustain period ends
    static shakeCamera(intensity, attack, decay, sustain, sustainLength, release)
    {
        var shakeEvent = new CameraShakeEvent(intensity, attack, decay, sustain, sustainLength, release, GamefeelMaster.cameraShakeResolution);
    }

    // slows down the game dramatically for the given length (given in seconds)
    static hitStop(length)
    {
        game.time.slowMotion = 40;
        game.time.events.add(Phaser.Timer.SECOND * length, function() {game.time.slowMotion = 1;}, this);
    }
}