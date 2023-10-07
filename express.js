//express.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const ipAddress = "127.0.0.1"; // 원하는 IP 주소를 지정
const bodyParser = require("body-parser");
const mysql = require("mysql2"); // mysql 모듈 사용
const dotenv = require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   database: "sw",
// });

const db = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

db.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결 오류:", err);
    return;
  }
  console.log("데이터베이스 연결 성공");
});

app.get("/news/:id", (req, res) => {
  const params = req.params; //{id : 값} 형태로 들어옵니다.
  const { id } = params; //ES6 Destructuring
  const sqlQuery = `SELECT * from news_articles`;
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
  console.log(id);
});

//세팅한 app을 실행시킨다.
app.listen(port, ipAddress, () => {
  console.log("서버 작동");
});
