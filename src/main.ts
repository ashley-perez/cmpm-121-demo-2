import "./style.css";
import { Line, LinePreview, Sticker, DrawableItem } from "./Classes.ts";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "SketchPad";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const zero = 0;
const thin = 2;
const thick = 5;
let currentThickness = 2;
const stickerSize = 20;

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

// thin and thick button tools
const thinMarkerButton = document.createElement("button");
thinMarkerButton.innerText = "thin";
thinMarkerButton.classList.add("selectedTool");
buttonContainer.append(thinMarkerButton);

const thickMarkerButton = document.createElement("button");
thickMarkerButton.innerText = "thick";
buttonContainer.append(thickMarkerButton);


// sticker buttons
const starStickerButton = document.createElement("button");
starStickerButton.innerText = "⭐";
buttonContainer.append(starStickerButton);

const rainbowStickerButton = document.createElement("button");
rainbowStickerButton.innerText = "🌈";
buttonContainer.append(rainbowStickerButton);

const turtleStickerButton = document.createElement("button");
turtleStickerButton.innerText = "🐢";
buttonContainer.append(turtleStickerButton);

let currentSticker: string | null = null;

rainbowStickerButton.addEventListener("click", () => {
  currentSticker = "🌈";
  canvas.dispatchEvent(new Event("tool-changed"));
});

starStickerButton.addEventListener("click", () => {
  currentSticker = "⭐";
  canvas.dispatchEvent(new Event("tool-changed"));
});

turtleStickerButton.addEventListener("click", () => {
  currentSticker = "🐢";
  canvas.dispatchEvent(new Event("tool-changed"));
});


const canvasContext = canvas.getContext("2d")!;
let cursorIsMoving = false;

const lines: DrawableItem[] = [];
const redoStack: DrawableItem[] = [];
let currentLine: Line | null = null;

let toolPreview: LinePreview | null = null;

// see if mouse is down and do things
canvas.addEventListener("mousedown", (event) => {
  cursorIsMoving = true;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  currentLine = new Line(x, y, currentThickness);

  toolPreview = null; // so we dont show the preview when clicking

  const selectedSticker = lines.find(line =>
    line instanceof Sticker &&
    line.x <= x &&
    line.x + line.size >= x &&
    line.y - line.size <= y &&
    line.y >= y
  );
  if (selectedSticker) {
    (selectedSticker as Sticker).isDragging = true;
    return;
  }

  if (currentSticker) {
    const sticker = new Sticker(x, y, currentSticker, stickerSize);
    lines.push(sticker);
    currentSticker = null;
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

// if mouse is up then stop drawing
canvas.addEventListener("mouseup", () => {
  if (currentLine) {
    lines.push(currentLine);
    currentLine = null;
  }
  cursorIsMoving = false;

  const draggingSticker = lines.find(line =>
    line instanceof Sticker &&
    line.isDragging
  );
  if (draggingSticker) {
    (draggingSticker as Sticker).isDragging = false;
  }

  canvas.dispatchEvent(new Event("drawing-changed"));
});

// lots of braincells were used unfortuneatly
// im tired
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const draggableSticker = lines.find(line => line instanceof Sticker && line.isDragging);

  // if a sticker is being dragged we update and exit this
  // so we don't draw a line
  if (draggableSticker) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    (draggableSticker as Sticker).x = x;
    (draggableSticker as Sticker).y = y;
    return;  // Don't proceed with line drawing
  }

  // start drawing the line
  if (cursorIsMoving && currentLine) {
    currentLine.extendLine(x, y);
    canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
    lines.forEach((cmd) => cmd.display(canvasContext));
    if (currentLine) {
      currentLine.display(canvasContext);
    }
  }

  // try to find sticker in line array and if it exists then drag it
  const draggingSticker = lines.find(line =>
    line instanceof Sticker &&
    line.isDragging
  );
  if (draggingSticker) {
    (draggingSticker as Sticker).x = x;
    (draggingSticker as Sticker).y = y;
    canvas.dispatchEvent(new Event("drawing-changed"));
    return; // don't want to draw a line
  }

  // show the preview
  if (!cursorIsMoving) {
    toolPreview = new LinePreview(x, y, currentThickness);
    canvas.dispatchEvent(new Event("tool-moved"));
  }

  // sticker moment
  if (currentSticker && !cursorIsMoving) {
    // show the sticker preview
    canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
    lines.forEach((cmd) => cmd.display(canvasContext));
    canvasContext.font = "20px serif";
    canvasContext.fillText(currentSticker, x, y);
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

// change line thickness
thinMarkerButton.addEventListener("click", function () {
  currentThickness = thin;
  thinMarkerButton.classList.add("selectedTool");
  thickMarkerButton.classList.remove("selectedTool");
});

thickMarkerButton.addEventListener("click", function () {
  currentThickness = thick;
  thickMarkerButton.classList.add("selectedTool");
  thinMarkerButton.classList.remove("selectedTool");
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

// tool moving event
canvas.addEventListener("tool-moved", () => {
  canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
  lines.forEach((cmd) => cmd.display(canvasContext));
  if (currentLine) {
    currentLine.display(canvasContext);
  }
  if (toolPreview) {
    toolPreview.draw(canvasContext);
  }
});
