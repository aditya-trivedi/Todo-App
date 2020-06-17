const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const TodoTask = require("./models/TodoTask");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.urlencoded({
   extended: true
}));


db = mongoose.connect('mongodb://localhost/todo',{ useNewUrlParser: true  , useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database Connected");
  app.listen(3000, () => console.log("Server Up and running"));
});

mongoose.set("useFindAndModify", false)

//post method
app.post('/',async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    console.log(err)
    res.redirect("/");
  }
});


app.use("/static",express.static("public"));

app.set("view engine", "ejs");


//get method
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});


//UPDATE
app.route("/edit/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  });
}).post((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});


//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
