import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "TESTING";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.id = "Canvas";
app.append(canvas);
