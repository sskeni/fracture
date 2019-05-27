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
            hit = Raycast.raycastToLineSegment(rectangle.points[i], rectangle.points[(i+1)%4], origin, vector);
            
            if(hit != false)
            {
                hits.push(hit);
            }
        }
        
        if(hits.length < 2)
        {
            return false;
        }
        
        //console.log("here");
        var closerIntersection = (hits[0].distance(origin) < hits[1].distance(origin) ? hits[0] : hits[1]);
        //console.log(closerIntersection);

        // if the point is either too far, or in the wrong direction, no hit occured
        if(origin.distance(closerIntersection) > vector.magnitude() || !closerIntersection.difference(origin).sameDirection(vector))
        {
            return false;
        }
        return closerIntersection;
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
        var lineB = new Line(origin, vector);

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