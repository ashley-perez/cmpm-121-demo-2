export interface DrawableItem {
    display(context: CanvasRenderingContext2D): void;
}

export class Line implements DrawableItem {
    private points: { x: number; y: number }[] = [];
    public thickness: number;
    public color: string;

    constructor(initialX: number, initialY: number, thickness: number, color: string) {
        this.points.push({ x: initialX, y: initialY });
        this.thickness = thickness;
        this.color = color;
    }

    extendLine(x: number, y: number) {
        this.points.push({ x, y });
    }

    display(context: CanvasRenderingContext2D) {
        context.lineWidth = this.thickness;
        context.strokeStyle = this.color; // change the line color

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
    color: string;

    // readonly is basically like const
    // from my understanding...

    // im sorry i have to...
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly start = 0;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly end = 2 * Math.PI;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly two = 2;

    constructor(x: number, y: number, thickness: number, color: string) {
        this.x = x;
        this.y = y;
        this.thickness = thickness;
        this.color = color;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.thickness / LinePreview.two, LinePreview.start, LinePreview.end); // circle to represent the tool thickness
        context.fillStyle = this.color;
        context.fill();
    }
}

export class Sticker implements DrawableItem {
    x: number;
    y: number;
    emoji: string;
    size: number;
    isDragging = false;

    constructor(x: number, y: number, emoji: string, size: number) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.size = size;
    }

    display(context: CanvasRenderingContext2D) {
        context.font = `${this.size}px serif`;
        context.fillText(this.emoji, this.x, this.y);
    }
}
