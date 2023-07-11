import { Controls } from "./controls";
import { Sensor } from "./sensor";
import { RoadBordersType } from "./type";
import { isPointInPolygon } from "./utils";

export class Car {
    x: number;
    y: number;

    readonly width: number;
    readonly height: number;

    controls: Controls;

    speed: number;

    acceleration: number;

    maxSpeed: number;

    friction: number;

    angle: number;

    sensor: Sensor;

    polygon: { x: number; y: number }[];

    damaged: boolean;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.5;
        this.maxSpeed = 10;
        this.friction = 0.05;
        this.angle = 0;

        this.damaged = false;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
        this.polygon = this.#createPolygon();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let index = 1; index < this.polygon.length; index++) {
            const point = this.polygon[index];
            ctx.lineTo(point.x, point.y);
        }
        ctx.fill();

        this.sensor.draw(ctx);
    }

    update(roadBorders: RoadBordersType[]): void {
        this.#move();

        this.polygon = this.#createPolygon();
        this.damaged = this.#checkDamage(roadBorders);

        this.sensor.update(roadBorders);
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        const flip = this.speed > 0;

        if (this.controls.left && this.speed != 0) {
            this.angle += flip ? 0.04 : -0.02;
        }
        if (this.controls.right && this.speed != 0) {
            this.angle -= flip ? 0.04 : -0.02;
        }

        // limit speed
        this.speed = this.speed > this.maxSpeed ? 3 : this.speed;
        this.speed = this.speed < -this.maxSpeed / 4 ? -this.maxSpeed / 4 : this.speed;

        // add friction
        this.speed = this.speed > 0 ? this.speed - this.friction : this.speed;
        this.speed = this.speed < 0 ? this.speed + this.friction : this.speed;

        // fixing drifting
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #createPolygon(): { x: number; y: number }[] {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2; // radius of the circle
        const alpha = Math.atan2(this.width, this.height); // angle of the triangle

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
    }

    #checkDamage(roadBorders: RoadBordersType[]): boolean {
        for (const border of roadBorders) {
            if (isPointInPolygon(this.polygon, border)) {
                return true;
            }
        }

        return false;
    }
}
