import { lerp } from "./utils";

export class NeuralNetwork {
    levels: Level[]; // levels[i] is the ith level of the network

    // neuronCount[i] is the number of inputs in the ith level
    // neuronCount.length is the number of levels in the network
    constructor(neuronCounts: number[]) {
        this.levels = [];

        // initialize the levels
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(givenInput: number[], network: NeuralNetwork): number[] {
        // feed the given input into the first level
        let outputs = Level.feedForward(givenInput, network.levels[0]);

        // feed the outputs of the previous level into the next level
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }

        // return the output of the network (the output of the last level)
        return outputs;
    }

    // mutate the network
    // mutationRate is the probability that a weight or bias will be mutated
    static mutate(network: NeuralNetwork, mutationRate: number = 1): void {
        // mutate the weights and biases of the network
        network.levels.forEach(level => {
            level.biases.forEach((bias, i) => {
                level.biases[i] = lerp(bias, Math.random() * 2 - 1, mutationRate);
            });
            level.weights.forEach((weight, i) => {
                weight.forEach((w, j) => {
                    level.weights[i][j] = lerp(w, Math.random() * 2 - 1, mutationRate);
                });
            });
        });
    }
}

export class Level {
    inputs: number[]; // values that the neuron receives from the previous layer
    outputs: number[]; // values that the neuron sends to the next layer
    biases: number[]; // biases[i] is the bias of neuron i
    weights: number[][]; // weights[i][j] is the weight of the connection between neuron i and neuron j

    constructor(inputCount: number, outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount); // values over which the neuron fires
        this.weights = [];

        // initialize the weights
        for (let i = 0; i < outputCount; i++) {
            this.weights[i] = new Array(inputCount) as number[];
        }

        Level.#randomize(this);
    }

    static #randomize(level: Level): void {
        for (let i = 0; i < level.outputs.length; i++) {
            level.biases[i] = Math.random() * 2 - 1; // random number between -1 and 1
            for (let j = 0; j < level.inputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1; // random number between -1 and 1
            }
        }
    }

    static feedForward(givenInput: number[], level: Level): number[] {
        // set the inputs of the level based on the given input
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInput[i];
        }

        // calculate the outputs of the level
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            // sum the inputs multiplied by the weights
            // console.log(level.weights);

            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[i][j];
            }

            // apply the activation function
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        // return the outputs of the level
        return level.outputs;
    }
}
