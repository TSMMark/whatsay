var d = window.document
  , ws = new WebSocket("ws://localhost:3000/")
  , inputField = d.getElementById("said");

ws.onopen = function () {
  console.log("open");
  ws.send("hello");
}

ws.onclose = function () {
  console.log("close");
}

ws.onmessage = function (e) {
  console.log("message: ", e.data);
}

window.onunload = function () {
  ws.close();
}

d.body.onclick = function (event) {
  console.log("ws", ws);
  ws.send(JSON.stringify({message: inputField.value}));
}
