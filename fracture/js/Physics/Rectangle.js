class Rectangle
{
    points;

    constructor(pointA, pointB, pointC, pointD)
    {
        this.points = new Array();
        this.points.push(pointA);
        this.points.push(pointB);
        this.points.push(pointC);
        this.points.push(pointD);
    }

    // assumes that the sprite has the fields hitboxWidth and hitboxHeight, as well as a p2 Body
    static createFromSprite(sprite)
    {
        var xAxis = new Vector(1, 0).rotate(sprite.body.angle);
        var yAxis = xAxis.rotate(90);
        
        var cornerLocation = new Vector(sprite.body.x, sprite.body.y);
        cornerLocation = cornerLocation.sum(xAxis.multiply(-sprite.anchor.x * sprite.hitboxWidth));
        cornerLocation = cornerLocation.sum(yAxis.multiply(-sprite.anchor.y * sprite.hitboxHeight))
        
        var pointA = cornerLocation;
        console.log(sprite.hitboxWidth);
        var pointB = cornerLocation.sum(xAxis.multiply(sprite.hitboxWidth));
        var pointC = pointB.sum(yAxis.multiply(sprite.hitboxHeight));
        var pointD = cornerLocation.sum(yAxis.multiply(sprite.hitboxHeight));

        return new Rectangle(pointA, pointB, pointC, pointD);
    }
}