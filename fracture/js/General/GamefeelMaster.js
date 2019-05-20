class GamefeelMaster
{
    static cameraShakeResolution = 100;// with what frequency the camera shake adjusts intensity

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
}