export class Line {
  private points: { x: number; y: number }[] = [];
  public thickness: number;
  // private zero = 0;

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

    // context.moveTo(this.points[this.zero].x, this.points[this.zero].y);
    for (const point of this.points) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();
  }
}
