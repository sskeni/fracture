class Vector
{
    x;
    y;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    static createVectorFromAngle(angle)
    {
        var x = Math.sin((angle + 90) * Math.PI / 180);
        var y = Math.cos((angle + 90) * Math.PI / 180);
        return new Vector(x, y);
    }

    // checks if this vector is in the same hemisphere as the other vector
    sameDirection(vector)
    {
        return this.dot(vector) > 0;
    }

    // returns the dot product of this vector and the passed vector
    dot(vector)
    {
        return this.x * vector.x + this.y * vector.y;
    }

    // returns the magnitude of this vector
    magnitude()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // sets this vector's magnitude to the given value
    setMagnitude(magnitude)
    {
        var oldMagnitude = this.magnitude();
        this.x = (this.x/oldMagnitude) * magnitude;
        this.y = (this.y/oldMagnitude) * magnitude;
        return this;
    }

    // multiplies this vector by the given scalar
    multiply(scalar)
    {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    // returns a copy of this vector
    copy()
    {
        return new Vector(this.x, this.y);
    }

    projectOnto(vector)
    {
        var magnitude = this.magnitude();
        if(magnitude != 0)
        {
            var copy = this.copy();
            var product = this.dot(vector)/(magnitude * magnitude);
            copy.multiply(product);
            return copy;
        }
        else return new Vector(0, 0);
        
    }

    sum(vector)
    {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

}