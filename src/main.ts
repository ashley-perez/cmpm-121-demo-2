import "./style.css";
import { Line } from "./Line.ts";

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

const lines: Line[] = [];
let currentLine: Line | null = null;
const redoStack: Line[] = [];

// see if mouse is down and do things
canvas.addEventListener("mousedown", (event) => {
  cursorIsMoving = true;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  currentLine = new Line(x, y);
});

// if mouse is up then stop drawing
canvas.addEventListener("mouseup", () => {
  if (currentLine) {
    lines.push(currentLine);
    currentLine = null;
  }
  cursorIsMoving = false;
  canvas.dispatchEvent(new Event("drawing-changed"));
});

// lots of braincells were used unfortuneatly
canvas.addEventListener("mousemove", (event) => {
  if (!cursorIsMoving || !currentLine) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  currentLine.extendLine(x, y);

  canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
  lines.forEach((cmd) => cmd.display(canvasContext));
  if (currentLine) {
    currentLine.display(canvasContext);
  }
});

// undo and redo button click event
undoButton.addEventListener("click", () => {
  if (lines.length) {
    const lastCommand = lines.pop();
    redoStack.push(lastCommand!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

redoButton.addEventListener("click", () => {
  if (redoStack.length) {
    const commandToRedo = redoStack.pop();
    lines.push(commandToRedo!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("drawing-changed", () => {
  canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
  lines.forEach((cmd) => cmd.display(canvasContext));
});

// implement the clear button fucntionality
clearButton.addEventListener("click", () => {
  canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
  lines.length = 0;
  redoStack.length = 0;
});
