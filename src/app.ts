import { Car } from "./car";
import { NeuralNetwork } from "./network";
import { Road } from "./road";
import { Visualizer } from "./visualizer";

// https://www.youtube.com/watch?v=Rs_rAxEsAvI

const carCanvas = document.querySelector<HTMLCanvasElement>("#carCanvas")!;
carCanvas.width = 200;

const networkCanvas = document.querySelector<HTMLCanvasElement>("#networkCanvas")!;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d")!;
const networkCtx = networkCanvas.getContext("2d")!;

const saveButton = document.querySelector<HTMLButtonElement>("#save")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;
saveButton.addEventListener("click", () => {
    save();
    console.log("Saved best brain to local storage");
});
resetButton.addEventListener("click", () => {
    deleteBestBrain();
    console.log("Deleted best brain from local storage");
});

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const cars = generateCars(100);
const traffic = [
    new Car(road.getLaneCenter(1), 200, 30, 50, "NONE", 1),
    new Car(road.getLaneCenter(0), -100, 30, 50, "NONE", 1),
    new Car(road.getLaneCenter(2), -100, 30, 50, "NONE", 1),
    new Car(road.getLaneCenter(2), -300, 30, 50, "NONE", 1),
    new Car(road.getLaneCenter(0), -300, 30, 50, "NONE", 1),
    new Car(road.getLaneCenter(1), -500, 30, 50, "NONE", 1),
];

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    cars.forEach((car, i) => {
        car.brain = JSON.parse(localStorage.getItem("bestBrain")!);
        if (i !== 0) {
            // mutate the brain of every car except the first one
            NeuralNetwork.mutate(car.brain!, 0.05);
        }
    });
    const bestBrain = JSON.parse(localStorage.getItem("bestBrain")!);
    bestCar.brain = bestBrain;
    console.log("Loaded best brain from local storage");
}

const animate = (time: number): void => {
    bestCar = getBestCar(cars);

    carCanvas.height = window.innerHeight; // resize canvas to fit the screen
    networkCanvas.height = window.innerHeight; // resize canvas to fit the screen
    carCtx.translate(0, -bestCar.y + carCanvas.height / 1.3); // make the camera follow the car

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
    bestCar.draw(carCtx, "blue", true);

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain!);
    requestAnimationFrame(animate);
};

function generateCars(N: number): Car[] {
    const cars = [];
    for (let index = 0; index < N; index++) {
        cars.push(new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 5));
    }
    return cars;
}

// fitness function
function getBestCar(cars: Car[]): Car {
    return cars.find(car => car.y === Math.min(...cars.map(car => car.y)))!;
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function deleteBestBrain() {
    localStorage.removeItem("bestBrain");
}

animate(0);
