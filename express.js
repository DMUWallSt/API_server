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

app.get("/news/:corpName", (req, res) => {
  const params = req.params;
  const { corpName } = params;
  const newsQuery = `SELECT * FROM news_table WHERE keyword = "${corpName}"`;
  const corpQuery = `SELECT name,stock_code,recen_score,finance_score,stock_today,market_cap,trading_vol,total_score,ratio,diff FROM company_info WHERE NAME = "${corpName}"`;

  // Execute the first query
  db.query(newsQuery, (err, newsResult) => {
    if (err) {
      console.error("Error executing the news query:", err);
      res.status(500).send("An error occurred");
      return;
    }

    // Execute the second query
    db.query(corpQuery, (err, corpResult) => {
      if (err) {
        console.error("Error executing the corp query:", err);
        res.status(500).send("An error occurred");
        return;
      }

      // Combine both results into a single object
      const combinedResult = {
        news: newsResult,
        company: corpResult,
      };

      // Send the combined result to the client
      res.send(combinedResult);
    });
  });
});

//세팅한 app을 실행시킨다.
app.listen(port, ipAddress, () => {
  console.log("서버 작동");
});
