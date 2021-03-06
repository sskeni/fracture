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
        var x = Math.cos((angle) * Math.PI / 180);
        var y = Math.sin((angle) * Math.PI / 180);
        return new Vector(x, y);
    }

    // returns the distance between this vector and the given vector
    distance(vector)
    {
        return Math.sqrt((this.x - vector.x)*(this.x - vector.x) + (this.y - vector.y)*(this.y - vector.y));
    }

    // returns whether this vector is equal to the given vector
    equals(vector)
    {
        return this.x == vector.x && this.y == vector.y;
    }

    // returns the square of the distance between this vector and the given vector
    squareDistance(vector)
    {
        return (this.x - vector.x)*(this.x - vector.x) + (this.y - vector.y)*(this.y - vector.y);
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
        return new Vector((this.x/oldMagnitude) * magnitude, (this.y/oldMagnitude) * magnitude);
    }

    // multiplies this vector by the given scalar
    multiply(scalar)
    {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    // returns a copy of this vector
    copy()
    {
        return new Vector(this.x, this.y);
    }

    // returns the vector projection of this vector onto the given vector
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

    // returns the sum of this vector and the given vector
    sum(vector)
    {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    // returns the difference of this vector and the given vector
    difference(vector)
    {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    // returns the result of rotating this vector clockwise by the given degrees
    rotate(angle)
    {
        //rotate the vector clockwise by the given degrees
        var x = this.x * Math.cos(angle * Math.PI / 180) - this.y * Math.sin(angle * Math.PI / 180);
        var y = this.x * Math.sin(angle * Math.PI / 180) + this.y * Math.cos(angle * Math.PI / 180);

        return new Vector(x, y);
    }

    // returns a copy of this vector with both components positive
    makePositive()
    {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }

}