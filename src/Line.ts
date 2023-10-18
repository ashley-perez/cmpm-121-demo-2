export class Line {
    private points: { x: number; y: number }[] = [];
    // private zero = 0;

    constructor(initialX: number, initialY: number) {
        this.points.push({ x: initialX, y: initialY });
    }

    extendLine(x: number, y: number) {
        this.points.push({ x, y });
    }

    display(context: CanvasRenderingContext2D) {
        if (!this.points.length) {
            return;
        }

        context.beginPath();

        const [firstPoint] = this.points;
        context.moveTo(firstPoint.x, firstPoint.y);

        // context.moveTo(this.points[this.zero].x, this.points[this.zero].y);
        for (const point of this.points) {
            context.lineTo(point.x, point.y);
        }
        context.stroke();
    }
}
