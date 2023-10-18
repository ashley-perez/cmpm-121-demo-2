export class Line {
    private points: { x: number; y: number }[] = [];
    public thickness: number;

    constructor(initialX: number, initialY: number, thickness: number) {
        this.points.push({ x: initialX, y: initialY });
        this.thickness = thickness;
    }

    extendLine(x: number, y: number) {
        this.points.push({ x, y });
    }

    display(context: CanvasRenderingContext2D) {
        context.lineWidth = this.thickness;

        if (!this.points.length) {
            return;
        }

        context.beginPath();

        const [firstPoint] = this.points;
        context.moveTo(firstPoint.x, firstPoint.y);

        for (const point of this.points) {
            context.lineTo(point.x, point.y);
        }
        context.stroke();
    }
}

export class LinePreview {
    x: number;
    y: number;
    thickness: number;

    constructor(x: number, y: number, thickness: number) {
        this.x = x;
        this.y = y;
        this.thickness = thickness;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.thickness / 2, 0, 2 * Math.PI); // circle to represent the tool thickness
        context.fill();
    }
}
