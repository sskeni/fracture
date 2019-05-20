class CameraShakeEvent
{
    intensity;// the maximum camera shake intensity
    attack;// the time it takes to reach max intensity
    decay;// the amount of time it takes to reach the sustained intensity
    sustain;// the intensity of the sustained shake
    sustainLength;// the time spent at the sustain value
    release;// the amount of time it takes to reach no shake after the sustain period ends
    resolution;// how often to update the camera shake value

    startTime;

    constructor(intensity, attack, decay, sustain, sustainLength, release, resolution)
    {
        this.intensity = intensity;
        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.sustainLength = sustainLength;
        this.release = release;
        this.resolution = resolution;

        this.startTime = game.time.now;

        this.progress();
    }

    // update the camera shake state
    progress()
    {
        
        if(game.time.now < this.startTime + this.attack + this.decay + this.sustainLength + this.release)
        {
            game.camera.shake(this.calculateCurrentIntensity(), this.resolution, true);
            game.time.events.add(this.resolution, this.progress, this);
        }
    }

    calculateCurrentIntensity()
    {
        var lerpBetween = new Array();
        if(game.time.now - this.startTime < this.attack)
        {
            lerpBetween.push(0);
            lerpBetween.push(this.intensity);
            return Phaser.Math.linearInterpolation(lerpBetween, ((game.time.now - this.startTime)/this.attack));
        }
        else if(game.time.now - this.startTime < this.attack + this.decay)
        {
            lerpBetween.push(this.intensity);
            lerpBetween.push(this.sustain);
            return Phaser.Math.linearInterpolation(lerpBetween, ((game.time.now - this.startTime - this.attack)/this.decay));
            //return ((game.time.now - this.startTime - this.attack)/this.decay) * this.intensity;
        }
        else if(game.time.now - this.startTime < this.attack + this.decay + this.sustainLength)
        {
            return this.sustain;
        }
        else
        {
            lerpBetween.push(this.sustain);
            lerpBetween.push(0);
            return Phaser.Math.linearInterpolation(lerpBetween, ((game.time.now - this.startTime - this.attack - this.sustainLength)/this.release));
        }
    }
}