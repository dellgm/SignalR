var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/delayed")
    .build();


function traditionalHubs() {
    
    connection.on("Sale", (message) => {
        console.log(message);
    });
    connection.invoke("NewMessage");
}
function streamsGetRandomNumber() {

    var ul = document.getElementById("numbers");

    connection.stream("GetRandomNumber", 1000).subscribe({
        next: (item) => {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(item));
            ul.appendChild(li);
            console.log(item);
        },
        complete: () => {
            console.log("done!");
        },
        error: (err) => {
            console.error(err);
        }
    });
}
function streamsGetUsers() {

    var tb = document.getElementById("tb");
    var intas = 0;
    connection.stream("GetUsers", 100).subscribe({
        next: (item) => {
            intas++;

            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(intas));
            var td2 = document.createElement("td");
            td2.appendChild(document.createTextNode(item));
            tr.appendChild(td1);
            tr.appendChild(td2);
            tb.appendChild(tr);
        },
        complete: () => {
            console.log("done!");
        },
        error: (err) => {
            console.error(err);
        }
    });
}
setTimeout(() => {
    //traditionalHubs();
    //streamsGetRandomNumber();
    //streamsGetUsers();
}, 1000);
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        yield connection.start();
    }
    catch (e) {
        console.error(e.toString());
    }
}))();
