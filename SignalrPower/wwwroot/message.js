"use strict";

var connection2 = new signalR.HubConnectionBuilder().withUrl("/messages").build();

connection2.on("ReceiveMessage", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection2.on("UserConnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    var option = document.createElement("option");
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);
});

connection2.on("UserDisconnected", function (connectionId) {
    var groupElement = document.getElementById("group");

    for (var i = 0; i < groupElement.length; i++) {
        if (groupElement.options[i].value === connectionId) {
            groupElement.remove(i);
        }
    }

});

connection2.start().catch(function (err) {
    return console.error(err.toString());
});


document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;

    var groupElement = document.getElementById("group");
    var groupValue = groupElement.options[groupElement.selectedIndex].value;

    if (groupValue === "All" || groupValue === "Caller") {
        var method = groupValue === "All" ? "SendMessageToAll" : "SendMessageToCaller";

        connection2.invoke(method, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    else if (groupValue === "PrivateGroup") {
        connection2.invoke("SendMessageToGroup", "PrivateGroup", message).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        connection2.invoke("SendMessageToUser", groupValue, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    event.preventDefault();

});

document.getElementById("joinGroup").addEventListener("click", function (event) {
    connection2.invoke("JoinGroup", "PrivateGroup").catch(function (err) {
        return console.error(err.toString());
    });

    event.preventDefault();

});