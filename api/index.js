const express = require("express");
require('dotenv').config();
const cors = require("cors");


const tasks = require("./routes/tasks");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/api", tasks);

const port = process.env.API_PORT || 3210;

app.listen(port, function(){
  console.log('Server started on port' + port);
});
