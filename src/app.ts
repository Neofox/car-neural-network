import { Car } from "./car";
import { Road } from "./road";

// https://www.youtube.com/watch?v=Rs_rAxEsAvI

const canvas = document.querySelector<HTMLCanvasElement>("#myCanvas")!;
canvas.width = 200;

const ctx = canvas.getContext("2d")!;
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 400, 30, 50);
car.draw(ctx);

const animate = (): void => {
    canvas.height = window.innerHeight;

    car.update(road.borders);

    ctx.save();
    ctx.translate(0, -car.y + canvas.height / 1.3);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
};

animate();
