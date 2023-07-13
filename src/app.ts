import { Car } from "./car";
import { Road } from "./road";
import { Visualizer } from "./visualizer";

// https://www.youtube.com/watch?v=Rs_rAxEsAvI

const carCanvas = document.querySelector<HTMLCanvasElement>("#carCanvas")!;
carCanvas.width = 200;

const networkCanvas = document.querySelector<HTMLCanvasElement>("#networkCanvas")!;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d")!;
const networkCtx = networkCanvas.getContext("2d")!;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const mainCar = new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 5);
const traffic = [new Car(road.getLaneCenter(1), 200, 30, 50, "NONE", 1)];

const animate = (): void => {
    carCanvas.height = window.innerHeight; // resize canvas to fit the screen
    networkCanvas.height = window.innerHeight; // resize canvas to fit the screen
    carCtx.translate(0, -mainCar.y + carCanvas.height / 1.3); // make the camera follow the car

    // update
    for (const car of traffic) {
        car.update(road.borders, []);
    }
    mainCar.update(road.borders, traffic);

    // road draw
    road.draw(carCtx);

    // car draw
    for (const car of traffic) {
        car.draw(carCtx, "red");
    }
    mainCar.draw(carCtx, "blue");

    Visualizer.drawNetwork(networkCtx, mainCar.brain!);
    requestAnimationFrame(animate);
};

animate();
