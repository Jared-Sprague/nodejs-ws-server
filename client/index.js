// On both the client and server:
var sp = require('schemapack');

var playersSchema = sp.build(
    {
        name: "string",
        players: [{
            health: "varuint",
            jumping: "boolean",
            position: ["int16"],
            attributes: {str: 'uint8', agi: 'uint8', int: 'uint8'}
        }]
    });

var personSchema = sp.build([ { "name": "string", "numbers": [ "varint" ], "age": "uint8" } ]);

var model = {};
model.name = "model_name";

// On the client:
var players = [
    {
        health: 4000,
        jumping: false,
        position: [-540, 343, 1201],
        attributes: {str: 87, agi: 42, int: 22}
    },
    {
        health: 4000,
        jumping: true,
        position: [-540, 343, 1201],
        attributes: {str: 87, agi: 42, int: 22}
    },
];

model.players = players;


function updateStats(updateCount) {
    document.getElementById('update').innerHTML = updateCount;
}

var host = window.document.location.host.replace(/:.*/, '');

var ws = new WebSocket('ws://' + host + ':3000' + '/?name=Jared');

ws.onopen = function () {
    console.log("WebSocket connection established and ready.");
};

ws.onclose = function wsClose (e) {
    console.log('Connection closed:', e.code, e.reason);
};

ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    updateStats(data);
    console.log(data);
};

var binarySentCount = 0;

function sendBinary() {

    var persons = [
        { "name": "joe", "numbers": [ -3, 2, 5 ], "age": 42 },
        { "name": "john smith iv", "numbers": [], "age": 27 },
        { "name": "bobby", "numbers": [ -22, 1 ], "age": 6 },
    ];

    var buffer = playersSchema.encode(model);

    // var buffer = personSchema.encode(persons);

    ws.send(buffer, {binary: true});
}

function sendString() {
    // var pn = performance.now();

    ws.send(JSON.stringify(model));
}

setInterval(sendBinary, 1000);
setInterval(sendString, 1000);
