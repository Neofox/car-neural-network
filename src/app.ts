import { Car } from "./car";
import { Road } from "./road";

// https://www.youtube.com/watch?v=Rs_rAxEsAvI

const canvas = document.querySelector<HTMLCanvasElement>("#carCanvas")!;
canvas.width = 200;

const ctx = canvas.getContext("2d")!;
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const mainCar = new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 5);
const traffic = [new Car(road.getLaneCenter(1), 200, 30, 50, "NONE", 1)];

const animate = (): void => {
    canvas.height = window.innerHeight; // resize canvas to fit the screen
    ctx.translate(0, -mainCar.y + canvas.height / 1.3); // make the camera follow the car

    // update
    for (const car of traffic) {
        car.update(road.borders, []);
    }
    mainCar.update(road.borders, traffic);

    // road draw
    road.draw(ctx);

    // car draw
    for (const car of traffic) {
        car.draw(ctx, "red");
    }
    mainCar.draw(ctx, "blue");

    requestAnimationFrame(animate);
};

animate();
