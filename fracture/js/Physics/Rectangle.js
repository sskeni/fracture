class Rectangle
{
    points;
    tag;

    constructor(pointA, pointB, pointC, pointD, tag)
    {
        this.points = new Array();
        this.points.push(pointA);
        this.points.push(pointB);
        this.points.push(pointC);
        this.points.push(pointD);
        this.tag = tag;
    }

    // assumes that the sprite has a p2 Body
    // creates a rectangle with the given dimentions by referencing the position and rotation of the given sprite's body
    static createFromSprite(sprite, hitboxWidth, hitboxHeight)
    {
        var xAxis = new Vector(1, 0).rotate(sprite.body.angle);
        var yAxis = xAxis.rotate(90);
        
        var cornerLocation = new Vector(sprite.body.x, sprite.body.y);
        cornerLocation = cornerLocation.sum(xAxis.multiply(-sprite.anchor.x * hitboxWidth));
        cornerLocation = cornerLocation.sum(yAxis.multiply(-sprite.anchor.y * hitboxHeight))
        
        var pointA = cornerLocation;
        var pointB = cornerLocation.sum(xAxis.multiply(hitboxWidth));
        var pointC = pointB.sum(yAxis.multiply(hitboxHeight));
        var pointD = cornerLocation.sum(yAxis.multiply(hitboxHeight));

        return new Rectangle(pointA, pointB, pointC, pointD);
    }

    // creates a rectangle with the given dimentions by referencing the position and rotation of the given body
    static createFromBody(body, hitboxWidth, hitboxHeight)
    {
        var xAxis = new Vector(1, 0).rotate(body.angle);
        var yAxis = new Vector(0, 1).rotate(body.angle);
        
        var cornerLocation = new Vector(body.x, body.y);
        
        var pointA = cornerLocation;
        var pointB = cornerLocation.sum(xAxis.multiply(hitboxWidth));
        var pointC = pointB.sum(yAxis.multiply(hitboxHeight));
        var pointD = cornerLocation.sum(yAxis.multiply(hitboxHeight));

        return new Rectangle(pointA, pointB, pointC, pointD);
    }

    // debug method, draws points on the screen for the four points of this rectangle
    drawPoints()
    {
        for(let point of this.points)
        {
            game.debug.pixel(point.x, point.y);
        }
    }
}