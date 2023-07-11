export class Controls {

    forward: boolean = false;
    left: boolean = false;
    right: boolean = false;
    reverse: boolean = false;

    constructor(forward: boolean = false, left: boolean = false, right: boolean = false, reverse: boolean = false) {
        this.forward = forward;
        this.left = left;
        this.right = right;
        this.reverse = reverse;

        this.#addKeyboardListeners();
    }

    #addKeyboardListeners(): void {
        document.addEventListener("keydown", e => {
            switch (e.key) {
                case "ArrowLeft": {
                    this.left = true;
                    break;
                }
                case "ArrowRight": {
                    this.right = true;
                    break;
                }
                case "ArrowUp": {
                    this.forward = true;
                    break;
                }
                case "ArrowDown": {
                    this.reverse = true;
                    break;
                }
            }
        })

        document.addEventListener("keyup", e => {
            switch (e.key) {
                case "ArrowLeft": {
                    this.left = false;
                    break;
                }
                case "ArrowRight": {
                    this.right = false;
                    break;
                }
                case "ArrowUp": {
                    this.forward = false;
                    break;
                }
                case "ArrowDown": {
                    this.reverse = false;
                    break;
                }
            }
        })
    }
}