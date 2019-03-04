var express=require('express'),
app = express(),
port = process.env.PORT || 1337;

//Setup for credentials
var credentials = require('./credentials.json');
var mysql=require("mysql");
credentials.host="ids";

//Create connection
var connection = mysql.createConnection(credentials);
connection.connect(function(err){
    if(err){
        console.log("Problems with MySQL: "+err);
    } else {
        console.log("Connected to Database.");
    }
});

//Select database
connection.query('USE wololo',function(err,rows,fields){
    if(err){
        console.log('Error looking up databases');
    }
});


var buttons = [];

//Iterate over rows
connection.query('select * from till_buttons',function(err,rows,fields){
    console.log(rows)
    for(row in rows) {
        console.log(rows[row])
        buttons.push(rows[row]);
    }

    if(err){
        console.log('Error looking up databases');
    }
});




//    <div style="position:absolute;left:{{button.left}}px;top:{{button.top}}px"><button id="{{button.buttonID}}" >{{button.label}}</button></div>

//var buttons = format(sql.query)
//var buttons=[{"buttonID":1,"left":10,"top":70,"width":100,"label":"hotdogs","invID":1},
//     {"buttonID":2,"left":110,"top":70,"width":100,"label":"hambugers","invID":2},
//     {"buttonID":3,"left":210,"top":70,"width":100,"label":"bannanas","invID":3},
//     {"buttonID":4,"left":10,"top":120,"width":100,"label":"milkduds","invID":4}]; //static buttons

app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){ // handles the /buttons API
  res.send(buttons);
});

app.listen(port);
