import { Car } from "./car";
import { IntersectionType, RayType, RoadBordersType } from "./type";
import { getIntersection, lerp } from "./utils";

export class Sensor {
    car: Car;

    rayCount: number;
    rayLength: number;
    raySpread: number;
    rays: RayType[][];

    readings: IntersectionType[];

    constructor(car: Car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2; // 90 degrees

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders: RoadBordersType[], traffic: Car[]): void {
        this.#castRays();
        this.readings = [];
        for (const ray of this.rays) {
            const reading = this.#getReading(ray, roadBorders, traffic)!;
            this.readings.push(reading);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const [index, ray] of this.rays.entries()) {
            let end = this.rays[index][1];
            if (this.readings[index]) {
                end = this.readings[index];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "green";

            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";

            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }

    #castRays() {
        this.rays = [];
        for (let index = 0; index < this.rayCount; index++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : index / (this.rayCount - 1)
            );

            const start = {
                x: this.car.x,
                y: this.car.y,
            };
            const end = {
                x: this.car.x - Math.sin(this.car.angle + rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(this.car.angle + rayAngle) * this.rayLength,
            };

            this.rays.push([start, end]);
        }
    }

    #getReading(ray: RayType[], roadBorders: RoadBordersType[], traffic: Car[]): IntersectionType | null {
        let intersections = [];

        // check for road collisions
        for (const border of roadBorders) {
            const intersection = getIntersection(ray[0], ray[1], border[0], border[1]);
            if (intersection) {
                intersections.push(intersection);
            }
        }

        // check for traffic collisions
        for (const car of traffic) {
            const poly = car.polygon;
            for (let index = 0; index < poly.length; index++) {
                const intersection = getIntersection(ray[0], ray[1], poly[index], poly[(index + 1) % poly.length]);
                if (intersection) {
                    intersections.push(intersection);
                }
            }
        }

        if (intersections.length == 0) {
            return null;
        }
        const offsets = intersections.map(intersection => intersection.offset);
        const minOffset = Math.min(...offsets);

        return intersections.find(intersection => intersection.offset == minOffset)!;
    }
}
