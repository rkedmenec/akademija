const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
// var cors = require("cors")

// Express init
const app = express();

//MySQL init

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "mkmk",
	database: "sencha"
});

db.connect(error => {
	if (error) {
		throw error;
	} else {
		console.log("Database connected with express.js!");
	}
});

//Body-Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


//Get all data from database

app.get("/data", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	let sql = (`SELECT * FROM sencha.category, sencha.products;`)
	let querry = db.query(sql, (error, results) => {
		if (error) throw error
		res.send(results)
	})
});

// app.put("/data/:id", (req, res) => {
// 	// let sql = (`SELECT * FROM test.animals, test.foods;`)
// 	let querry = db.query(sql, (error, results) => {
// 		if (error) throw error
// 		res.send(results)
// 	})
// });



app.post('/category', function (req, res) {
var postData = req.body;

db.query("INSERT INTO category SET ?",
postData, function (error, results, fields) {
if (error) throw error;
console.log(results.categoryId); // Auto increment id
res.end(JSON.stringify(results));
});
});

// app.delete("/data/:id", (req, res) => {
// 	let sql = (`SELECT * FROM test.animals, test.foods;`)
// 	let querry = db.query(sql, (error, results) => {
// 		if (error) throw error
// 		res.send(results)
// 	})
// });

//Get individual food data from database 




const port = 9090;

app.listen(port, () => {
	console.log(`The server is listening on PORT: ${port}`);
});
