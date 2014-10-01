var d = window.document
  , ws = new WebSocket("ws://localhost:8080/")
  , $inputField = d.getElementById("said")
  , $messages = d.getElementById("messages")
  , username = prompt("Say your name:")
  , retryInterval
  , retryEveryMS = 1000;

function openSocket () {
  ws = new WebSocket("ws://localhost:8080/");

  ws.onopen = function () {
    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = undefined;
    }

    console.log("open");
    ws.send("hello");
  }

  ws.onclose = function () {
    console.log("close");
    retryInterval && clearInterval(retryInterval);
    retryInterval = setInterval(openSocket, retryEveryMS);
  }

  ws.onmessage = function (event) {
    var data = decodeMessage (event.data);
    switch (data.type) {
      case "keepalive":
        return;

      case "message":
        userMessage(data);
        break;

      default: 
        return;
    }
  }

  return ws;
}

function decodeMessage (data) {
  try {
    data = JSON.parse(data);
  } catch (_error) {
  }
  return data;
}

function prependChild(parent, child) {
  if (parent.firstChild) {
    parent.insertBefore(child, parent.firstChild);
  }
  else {
    parent.appendChild(child);
  }
}

function userMessage (data) {
  var message = data.message
    , username = data.username
    , paragraphNode
    , textNode;

  console.log(username + " says: ", message);

  paragraphNode = document.createElement("p");
  textNode = document.createTextNode(username + " said: " + message);
  paragraphNode.appendChild(textNode);

  prependChild($messages, paragraphNode);
}

openSocket();

window.onunload = function () {
  ws.close();
}

$inputField.onkeyup = function (event) {
  if (event.keyCode !== 13) {
    return;
  }

  var data = {
    type: "message",
    username: username,
    message: $inputField.value
  };

  ws.send(JSON.stringify(data), function (error) {
    console.log("ws error", error);
  });

  userMessage(data);

  $inputField.value = "";
}
