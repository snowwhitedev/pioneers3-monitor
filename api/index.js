const express = require("express");

const tasks = require("./routes/tasks");
const cors = require("cors");

const port = 3210;

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({extened:false}));
app.use(express.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/api", tasks);


app.listen(port, function(){
  console.log('Server started on port' + port);
});
