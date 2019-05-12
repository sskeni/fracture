class Raycast
{
    // returns the location of the closest of two intersections made between the given rectangle and the given line
    // if there is no intersection, this function returns false
    // rectangle: the Rectangle object to cast to
    // origin: a vector indicating the position in world space to begin the raycast from
    // vector: a vector indicating the direction and distance to raycast at
    static raycastToRectangle(rectangle, origin, vector)
    {
        var hits = new Array();
        var hit;

        for(let i = 0; i < 4; i++)
        {
            hit = raycastToLineSegment(rectangle.points[i], rectangle.points[(i+1)%4], origin, vector);
            if(hit != false)
            {
                hits.push(hit);
            }
        }

        if(hits.length < 0)
        {
            return false;
        }
        
        return (hits[0].distance(origin) < hits[1].distance(origin) ? hits[0] : hits[1]);
    }

    // returns the location of the intersection between the line segment defined by the two points given and the given line
    // if there is no intersection, this function returns false
    // pointA: the first of two points defining the line to raycast to
    // pointB: the second of two points defining the line to raycast to
    // origin: a vector indicating the position in world space to begin the raycast from
    // vector: a vector indicating the direction and distance to raycast at
    static raycastToLineSegment(pointA, pointB, origin, vector)
    {
        var lineA = Line.createFromPoints(pointA, pointB);
        var lineB = Line.createFromPoints(origin, origin.sum(vector));
        var intersectionPoint = Line.findIntersectionPoint(lineA, lineB);
        if(intersectionPoint == false)
        {
            return false;
        }

        if(intersectionPoint.distance(pointA) + intersectionPoint.distance(pointB) < pointA.distance(pointB) + 0.01)
        {
            return intersectionPoint;
        }
        else
        {
            return false;
        }
    }
}