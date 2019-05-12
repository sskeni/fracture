class Line
{
    origin;
    direction;

    constructor(origin, direction)
    {
        this.origin = origin;
        this.direction = direction.setMagnitude(1);
    }

    // takes two vector representations of points and creates a line
    // returns: the created line
    static createFromPoints(pointA, pointB)
    {
        return new Line(pointA, pointA.sum(-pointB.y));
    }

    // returns the point of intersection between the two given lines, or false if there is no intersection
    static findIntersectionPoint(lineA, lineB)
    {
        if(lineA.direction.equals(lineB.direction))// if the lines are parallel, there is no intersection
        {
            console.log("hey=");
            return false;
        }

        var x = (lineB.direction.x * lineA.origin.x - lineA.direction.x * lineB.origin.x)/(lineB.direction.x - lineA.direction.x);
        var y = (lineB.direction.y * lineA.origin.y - lineA.direction.y * lineB.origin.y)/(lineB.direction.y - lineA.direction.y);

        return new Vector(x, y);
    }
}