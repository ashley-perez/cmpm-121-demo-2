import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "TESTING";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const zero = 0;

// canvas to draw on
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.id = "Canvas";
app.append(canvas);

// create a container for the buttons and use flex
const buttonContainer = document.createElement("div");
buttonContainer.id = "buttonContainer";
app.append(buttonContainer);

// creating the clear button
const clearButton = document.createElement("button");
clearButton.innerText = "clear";
buttonContainer.append(clearButton);

// add undo button
const undoButton = document.createElement("button");
undoButton.innerText = "undo";
buttonContainer.append(undoButton);

// add redo button
const redoButton = document.createElement("button");
redoButton.innerText = "redo";
buttonContainer.append(redoButton);

const canvasContext = canvas.getContext("2d")!;
let cursorIsMoving = false;

const lines: { x: number; y: number }[][] = [];
const redoStack: { x: number; y: number }[][] = [];
let currentLineDrawn: { x: number; y: number }[] = [];

// see if mouse is down
canvas.addEventListener("mousedown", () => {
    cursorIsMoving = true;
    currentLineDrawn = []; // initialize line
    console.log("HELLO???");
});

// if mouse is up then stop drawing
canvas.addEventListener("mouseup", () => {
    cursorIsMoving = false;
    if (currentLineDrawn.length) {
        // lines.push([...currentLineDrawn]);
        lines.push(currentLineDrawn);
    }
    canvas.dispatchEvent(new Event("drawing-changed"));
});

// lots of braincells were used unfortuneatly
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (cursorIsMoving) {
        currentLineDrawn.push({ x, y });

        // Clear the canvas
        canvasContext.clearRect(zero, zero, canvas.width, canvas.height);

        // Redraw all lines
        for (const line of lines) {
            canvasContext.beginPath();
            for (const point of line) {
                canvasContext.lineTo(point.x, point.y);
                canvasContext.stroke();
            }
        }

        // Draw the current line being drawn
        canvasContext.beginPath();
        for (const point of currentLineDrawn) {
            canvasContext.lineTo(point.x, point.y);
            canvasContext.stroke();
        }
    }
});

undoButton.addEventListener("click", () => {
    console.log("in undo button");
    if (lines.length) {
        const lastLine = lines.pop(); // pop latest item
        redoStack.push(lastLine!); // push to stack but it could possible be null
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

redoButton.addEventListener("click", () => {
    console.log("in redo button");
    if (redoStack.length) {
        const lineToRedo = redoStack.pop(); // pop latest item
        lines.push(lineToRedo!);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

canvas.addEventListener("drawing-changed", () => {
    // clear the canvas or else it will persist
    canvasContext.clearRect(zero, zero, canvas.width, canvas.height);

    for (const line of lines) {
        canvasContext.beginPath();
        for (const point of line) {
            canvasContext.lineTo(point.x, point.y);
            canvasContext.stroke();
        }
    }
});

// implement the clear button fucntionality
clearButton.addEventListener("click", () => {
    canvasContext.clearRect(zero, zero, canvas.width, canvas.height);

    // clear these lists/stacks or else it will be remembered
    lines.length = 0;
    currentLineDrawn.length = 0;
    redoStack.length = 0;
});