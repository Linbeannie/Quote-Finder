const express = require('express');
const app = express();
const mysql = require('mysql');
const fetch = require("node-fetch");
app.set("view engine", "ejs");
app.use(express.static("public"));

//home route
app.get('/', async (req, res) => {

  let sql = `SELECT  * FROM q_author`;
  let sql2 = `SELECT DISTINCT category FROM q_quotes`;

  let authors = await getData(sql);
  let categories = await getData(sql2)


  res.render('index', {
    "authors": authors,
    "categories": categories,
  })
});

app.get('/author/:authorId', async (req, res) => {

    const authorId = req.params.authorId;
      let sql = `SELECT * FROM q_author`;
      let params = []

      if (req.params.authorId) { //if author was selected (if authorId has any value)
        sql += " WHERE authorId = ? ";
        params.push(req.params.authorId);
      }

    const data = await getData(sql, params)
    res.send(data);
})

//search route
app.get("/search", async function(req, res) {

  let word = req.query.keyword;

  let sql = `SELECT authorId, firstName, lastName, quote FROM q_quotes NATURAL JOIN q_author WHERE quote LIKE ? `;
  let params = [`%${word}%`]

  if (req.query.authorId) { //if author was selected (if authorId has any value)
    sql += "AND authorId = ? ";
    params.push(req.query.authorId);
  }

  if (req.query.category) {
    sql += "AND category = ? ";
    params.push(req.query.category);
  }

  let rows = await getData(sql, params);
  res.render('results', { "rows": rows });
});

async function getData(sql, params) {

  return new Promise(function(resolve, reject) {
    let conn = dbConnection();

    conn.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });

}//getData

//database
function dbConnection() {

  const pool = mysql.createPool({

    connectionLimit: 1000,
    host: "lyl3nln24eqcxxot.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z7pkm09esap508wq",
    password: "flfbuanv3xzavy8r",
    database: "priqbvjz2kdmuohc"

  });

  return pool;

} //dbConnection

app.listen(3000, () => {
  console.log('server started');
});
