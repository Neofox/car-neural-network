import { RoadBordersType } from "./type";
import { lerp } from "./utils";

export class Road {
    x: number;

    width: number;

    laneCount: number;

    left: number;
    right: number;

    top: number;
    bottom: number;

    borders: RoadBordersType[];

    constructor(x: number, width: number, laneCount: number = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const inf = 1000000;
        this.top = -inf;
        this.bottom = inf;

        this.borders = [
            [
                { x: this.left, y: this.top },
                { x: this.left, y: this.bottom },
            ],
            [
                { x: this.right, y: this.top },
                { x: this.right, y: this.bottom },
            ],
        ];
    }

    getLaneCenter(lane: number): number {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + laneWidth * Math.min(lane, this.laneCount - 1);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // draw lane lines
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let index = 1; index <= this.laneCount - 1; index++) {
            const x = lerp(this.left, this.right, index / this.laneCount);

            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        // draw borders
        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}
