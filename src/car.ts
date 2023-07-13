import { Controls } from "./controls";
import { NeuralNetwork } from "./network";
import { Sensor } from "./sensor";
import { ColorType, ControleTypeType, RoadBordersType } from "./type";
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

    polygon: { x: number; y: number }[];

    damaged: boolean;

    sensor: Sensor | undefined;
    brain: NeuralNetwork | undefined;
    useBrain: boolean;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        controlType: ControleTypeType,
        maxSpeed: number = 5
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.9;
        this.maxSpeed = maxSpeed;
        this.friction = 0.03;
        this.angle = 0;

        this.damaged = false;

        this.useBrain = controlType === "AI";

        if (controlType === "PLAYER" || controlType === "AI") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlType);
        this.polygon = this.#createPolygon();
    }

    draw(ctx: CanvasRenderingContext2D, color: ColorType, drawSensor: boolean = false): void {
        if (this.damaged) {
            ctx.fillStyle = "grey";
        } else {
            ctx.fillStyle = color;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let index = 1; index < this.polygon.length; index++) {
            const point = this.polygon[index];
            ctx.lineTo(point.x, point.y);
        }
        ctx.fill();

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }

    update(roadBorders: RoadBordersType[], traffic: Car[]): void {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#checkDamage(roadBorders, traffic);
        }

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(sensor => (sensor === null ? 0 : 1 - sensor.offset));
            const outputs = NeuralNetwork.feedForward(offsets, this.brain!);

            if (this.useBrain) {
                this.controls.forward = outputs[0] > 0.5;
                this.controls.left = outputs[1] > 0.5;
                this.controls.right = outputs[2] > 0.5;
                this.controls.reverse = outputs[3] > 0.5;
            }
        }
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
            this.angle += flip ? 0.02 : -0.02;
        }
        if (this.controls.right && this.speed != 0) {
            this.angle -= flip ? 0.02 : -0.02;
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

    #checkDamage(roadBorders: RoadBordersType[], traffic: Car[]): boolean {
        for (const border of roadBorders) {
            if (isPointInPolygon(this.polygon, border)) {
                return true;
            }
        }

        for (const car of traffic) {
            if (car !== this && isPointInPolygon(this.polygon, car.polygon)) {
                return true;
            }
        }

        return false;
    }
}
