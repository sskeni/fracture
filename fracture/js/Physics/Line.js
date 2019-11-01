class Line
{
    /*
    origin;
    direction;
    */

    constructor(origin, direction)
    {
        this.origin = origin;
        this.direction = direction.setMagnitude(1);
    }

    // takes two vector representations of points and creates a line
    // returns: the created line
    static createFromPoints(pointA, pointB)
    {
        return new Line(pointA, pointA.difference(pointB));
    }

    // returns the point of intersection between the two given lines, or false if there is no intersection
    static findIntersectionPoint(lineA, lineB)
    {
        if(lineA.isParallel(lineB))// if the lines are parallel, there is no intersection
        {
            return false;
        }
        
        var x_0 = lineA.origin.x;
        var x_1 = lineB.origin.x;
        var y_0 = lineA.origin.y;
        var y_1 = lineB.origin.y;
        
        var a_0 = lineA.direction.x;
        var a_1 = lineB.direction.x;
        var b_0 = lineA.direction.y;
        var b_1 = lineB.direction.y;
        
        if(b_0 != 0 && b_1 != 0)
        {
            var y = (x_1 - x_0 + ((a_0 * y_0)/b_0) - ((a_1 * y_1)/b_1))/((a_0/b_0)-(a_1/b_1));
            var x = ((a_0 * (y - y_0))/b_0) + x_0;
        }
        else
        {
            var x = ((lineB.direction.x * lineA.origin.x) - (lineA.direction.x * lineB.origin.x))/(lineB.direction.x - lineA.direction.x);
            var y = ((lineB.direction.y * lineA.origin.y) - (lineA.direction.y * lineB.origin.y))/(lineB.direction.y - lineA.direction.y);
        }


        return new Vector(x, y);
    }

    // returns whether this line and the given line are parallel
    isParallel(line)
    {
        return this.direction.equals(line.direction) || this.direction.equals(line.direction.multiply(-1));
    }
}