export type RoadBordersType = { x: number; y: number }[];

export type RayType = { x: number; y: number };

export type IntersectionType = {
    x: number;
    y: number;
    offset: number;
};

export type PolygonType = { x: number; y: number }[];

export type ControleTypeType = "PLAYER" | "AI" | "NONE";

export type ColorType = "red" | "blue" | "green" | "yellow" | "black" | "white";

export type NeuronType = {
    inputs: number[];
    outputs: number[];
    biases: number[];
    weights: number[][];
};
