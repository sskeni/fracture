class Line
{
    slope;
    intersect;

    constructor(slope, intersect)
    {
        this.slope = slope;
        this.intersect = intersect;
    }

    // takes two vector representations of points and creates a line
    // returns: the created line
    static createFromPoints(pointA, pointB)
    {
        var slope = (pointA.x - pointB.x)/(pointA.y - pointB.y);
        return new Line(slope, pointA.y - slope*pointB.y);
    }

    // returns the point of intersection between the two given lines, or false if there is no intersection
    static findIntersectionPoint(lineA, lineB)
    {
        if(lineA.slope == lineB.slope)// if the lines are parallel, there is no intersection
        {
            return false;
        }

        var x = (lineB.intersect - lineA.intersect )/(lineA.slope - lineB.slope);
        var y = lineA.slope*x + lineA.intersect;

        return new Vector(x, y);
    }
}