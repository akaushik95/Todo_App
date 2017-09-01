var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var todosDB = require("./seed.js");

var app = express();
app.use(morgan('combined'));
app.use("/", express.static(__dirname+"/public"));
app.use("/", bodyParser.urlencoded({extended : false}));

app.get("/api/todos", function (req, res) {
    res.json(todosDB.todos);
});

app.delete("/api/todos/:id", function (req, res) {
   var id = req.params.id;
   var todo = todosDB.todos[id];
   if(!todo){
       res.status(400).json({error : "Todo does not exists, Please enter a valid ID. "});
   }else{
       todo.status = todosDB.statusENUMS.DELETED;
       res.json(todosDB.todos);
   }
});

app.post("/api/todos", function (req, res) {
    var todo = req.body.title;
    if(!todo || todo == "" || todo.trim() == ""){
        res.status(400).json({error : "Please enter a valid input in todo title."});
    }else{
        var newTodo = {
            title : todo,
            status : todosDB.statusENUMS.ACTIVE
        }
        todosDB.todos[todosDB.nextID++] = newTodo;
        res.json(todosDB.todos);

    }
});

app.put("/api/todos/:id", function (req, res) {
   var id =req.params.id;
   var todo = todosDB.todos[id];
   if(!todo){
       res.status(400).json({error : "Todo does not exist, Please enter a valid todo ID."});
   }else{
       var title = req.body.title;
       var status = req.body.status;
       if(title && title != "" && title.trim() != ""){
           todo.title = title;
       }
       if(status && (status == todosDB.statusENUMS.ACTIVE || status == todosDB.statusENUMS.COMPLETED)){
           todo.status = status;
       }
       res.json(todosDB.todos);
   }

});

app.get("/api/todos/active", function (req, res) {
   var todos = todosDB.todos;
   var activeTodos={};

   for(var todo in todos){
       if(todosDB.todos[todo].status == todosDB.statusENUMS.ACTIVE){
           activeTodos[todo] = todosDB.todos[todo];
       }
   }
   res.json(activeTodos);
});

app.get("/api/todos/complete", function (req, res) {
    var todos = todosDB.todos;
    var completedTodos={};

    for(var todo in todos){
        if(todosDB.todos[todo].status == todosDB.statusENUMS.COMPLETED){
            completedTodos[todo] = todosDB.todos[todo];
        }
    }
    res.json(completedTodos);
});

app.get("/api/todos/deleted", function (req, res) {
    var todos = todosDB.todos;
    var deletedTodos={};

    for(var todo in todos){
        if(todosDB.todos[todo].status == todosDB.statusENUMS.DELETED){
            deletedTodos[todo] = todosDB.todos[todo];
        }
    }
    res.json(deletedTodos);
});

app.put("/api/todos/complete/:id", function (req, res) {
   var id = req.params.id;
   var todo = todosDB.todos[id];
    if(!todo){
        res.status(400).json({error : "Todo does not exist, Please enter a valid todo ID."});
    }else{
        todo.status = todosDB.statusENUMS.COMPLETED;
        res.json(todosDB.todos);
    }

});

app.put("/api/todos/active/:id", function (req, res) {
    var id = req.params.id;
    var todo = todosDB.todos[id];
    if(!todo){
        res.status(400).json({error : "Todo does not exist, Please enter a valid todo ID."});
    }else{
        todo.status = todosDB.statusENUMS.ACTIVE;
        res.json(todosDB.todos);
    }

});

var callback = function () {
    console.log("!!! Server is Running !!!");
};

app.listen(3000, callback);