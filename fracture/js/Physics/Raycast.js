class Raycast
{
    // returns the location of the closest of two intersections made between the given rectangle and the given line
    // if there is no intersection, this function returns false
    // rectangle: the Rectangle object to cast to
    // origin: a vector indicating the position in world space to begin the raycast from
    // vector: a vector indicating the direction and distance to raycast at
    static raycastToRectangle(rectangle, origin, vector)
    {
        //console.log(rectangle);
        var hits = new Array();
        var hit;
        
        //console.log("hey");
        for(let i = 0; i < 4; i++)
        {
            //console.log(rectangle.points[i]);
            //console.log(rectangle.points[(i+1)%4]);
            hit = Raycast.raycastToLineSegment(rectangle.points[i], rectangle.points[(i+1)%4], origin, vector);
            //console.log(hit);
            if(hit != false)
            {
                hits.push(hit);
            }
        }
        
        if(hits.length < 2)
        {
            return false;
        }

        closerIntersection = (hits[0].distance(origin) < hits[1].distance(origin) ? hits[0] : hits[1]);

        if(origin.distance(closerIntersection) < vector.magnitude())
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
        //console.log(pointA);
        //console.log(pointB);
        var lineA = Line.createFromPoints(pointA, pointB);
        //console.log(lineA);
        var lineB = Line.createFromPoints(origin, origin.sum(vector));
        //console.log(lineB);
        var intersectionPoint = Line.findIntersectionPoint(lineA, lineB);
        if(intersectionPoint == false)
        {
            return false;
        }

        console.log(intersectionPoint.distance(pointA) + intersectionPoint.distance(pointB));
        console.log(pointA.distance(pointB) + 0.01);
        
        if(intersectionPoint.distance(pointA) + intersectionPoint.distance(pointB) < pointA.distance(pointB) + 0.01)
        {
            //console.log("happy");
            return intersectionPoint;
        }
        else
        {
            console.log("sad");
            return false;
        }
    }
}