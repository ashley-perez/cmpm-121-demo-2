import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "TESTING";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// canvas to draw on
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.id = "Canvas";
app.append(canvas);

const buttonContainer = document.createElement("div");
buttonContainer.id = "buttonContainer";
app.append(buttonContainer);

const clearButton = document.createElement("button");
clearButton.innerText = "clear";
buttonContainer.append(clearButton);

const canvasContext = canvas.getContext("2d")!;
let cursorIsMoving = false;

// see if mouse is down
canvas.addEventListener("mousedown", () => {
    cursorIsMoving = true;
    console.log("IN HERE");
});

// if mouse is up then stop drawing and reset the path
canvas.addEventListener("mouseup", () => {
    cursorIsMoving = false;
    canvasContext.beginPath();
});

canvas.addEventListener("mousemove", draw);

// lets actually draw
function draw(event: MouseEvent) {
    if (!cursorIsMoving) {
        return;
    }

    canvasContext.lineWidth = 2;
    canvasContext.lineCap = "round";

    canvasContext.lineTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop,
    );
    canvasContext.stroke();
    canvasContext.beginPath();
    canvasContext.moveTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop,
    );
}

const zero = 0;
clearButton.addEventListener("click", () => {
    canvasContext.clearRect(zero, zero, canvas.width, canvas.height);
});