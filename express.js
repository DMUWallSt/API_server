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

app.get("/ratio", (req, res) => {
  const ratioQuery = `SELECT NAME,stock_today,ratio,diff FROM company_info ORDER BY ratio DESC LIMIT 8`;
  db.query(ratioQuery, (err, Result) => {
    if (err) {
      console.error("Error executing the news query:", err);
      res.status(500).send("An error occurred");
      return;
    }
    console.log(Result);
    res.send(Result);
  });
});

app.get("/stock_today", (req, res) => {
  const stock_todayQuery = `SELECT NAME,stock_today,diff,ratio FROM company_info ORDER BY stock_today DESC LIMIT 8`;
  db.query(stock_todayQuery, (err, Result) => {
    if (err) {
      console.error("Error executing the news query:", err);
      res.status(500).send("An error occurred");
      return;
    }
    console.log(Result);
    res.send(Result);
  });
});

app.get("/market_cap", (req, res) => {
  const market_capQuery = `SELECT NAME,market_cap,stock_today,ratio FROM company_info ORDER BY market_cap DESC LIMIT 8`;
  db.query(market_capQuery, (err, Result) => {
    if (err) {
      console.error("Error executing the news query:", err);
      res.status(500).send("An error occurred");
      return;
    }
    console.log(Result);
    res.send(Result);
  });
});

app.get("/trading_vol", (req, res) => {
  const trading_volQuery = `SELECT NAME,trading_vol,stock_today,ratio FROM company_info ORDER BY trading_vol DESC LIMIT 8`;
  db.query(trading_volQuery, (err, Result) => {
    if (err) {
      console.error("Error executing the news query:", err);
      res.status(500).send("An error occurred");
      return;
    }
    console.log(Result);
    res.send(Result);
  });
});

app.get("/wordCloud", (req, res) => {
  const wordCloudQuery = `
  (SELECT NAME, ratio FROM company_info ORDER BY ratio DESC LIMIT 4)
  UNION
  (SELECT NAME, ratio FROM company_info ORDER BY ratio ASC LIMIT 4)`;

  db.query(wordCloudQuery, (err, Result) => {
    if (err) {
      console.error("Error executing the news query:", err);
      res.status(500).send("An error occurred");
      return;
    }
    res.send(Result);
  });
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
