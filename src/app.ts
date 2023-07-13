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
const cars = generateCars(100);
const traffic = [new Car(road.getLaneCenter(1), 200, 30, 50, "NONE", 1)];

const animate = (time: number): void => {
    const mainCar = cars.find(car => car.y === Math.min(...cars.map(car => car.y)))!;

    carCanvas.height = window.innerHeight; // resize canvas to fit the screen
    networkCanvas.height = window.innerHeight; // resize canvas to fit the screen
    carCtx.translate(0, -mainCar.y + carCanvas.height / 1.3); // make the camera follow the car

    // update
    for (const carTraffic of traffic) {
        carTraffic.update(road.borders, []);
    }
    for (const car of cars) {
        car.update(road.borders, traffic);
    }

    // road draw
    road.draw(carCtx);

    // car draw
    for (const car of traffic) {
        car.draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.3;
    for (const car of cars) {
        car.draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    mainCar.draw(carCtx, "blue", true);

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, mainCar.brain!);
    requestAnimationFrame(animate);
};

function generateCars(N: number): Car[] {
    const cars = [];
    for (let index = 0; index < N; index++) {
        cars.push(new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 5));
    }
    return cars;
}

animate(0);
