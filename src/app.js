var express = require("express");
var path = require("path");
var hbs = require("hbs");
var app = express();
var staticpath = path.join(__dirname, "../public");
var templatespath = path.join(__dirname, "../templates/views");
var partialspath = path.join(__dirname, "../templates/partials");
app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", templatespath);
hbs.registerPartials(partialspath);
app.get("/", (req, res) => {
  const data = {
    title: "Home page",
    message: "My name is ",
    first_name: "Rubel",
    last_name: "Parvaz",
  };
  res.render("index", { data, title: "Express", session: req.session });
});

app.get("/formtest", (req, res) => {
  res.send(`<input type="text" value="${req.query.name}">`);
  res.end();
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

var router = express.Router();
var database = require("./database");
app.post("/login", function (request, response, next) {
  var user_email_address1 = request.query.user_email_address;
  var user_password = request.query.user_password;

  if (user_email_address1 && user_password) {
    query = `
      SELECT * FROM user_login 
      WHERE user_email = "${user_email_address1}"
    `;

    database.query(query, function (error, data) {
      if (error) {
        console.error("Error querying the database: ", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (data.length > 0) {
        response.status(400).json({ error: "Email Address already in use" });
      } else {
        const sql =
          "INSERT INTO user_login (user_email, user_password) VALUES (?, ?)";
        const values = [user_email_address1, user_password];

        database.query(sql, values, (err, result) => {
          if (err) {
            console.error("Error inserting user into the database: ", err);
            response.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("User added successfully");
            response.status(200).json({ message: "User added successfully" });
          }
        });
      }
    });
  } else {
    response.status(400).json({ error: "Please Enter Email Address and Password Details" });
  }
});

app.get("/userdata", (request, response) => {
  var userId = request.query.user_Id;
  if(userId){
    query = `SELECT * FROM user_login WHERE user_id = "${userId}"`;
    database.query(query, function (error, data) {
      if (error) {
        response.status(500).json({ error: "Internal Server Error" });
      } else {
        response.status(200).json({ data });
      }
    });
  }else{
    response.status(400).json({ error: "Please Enter User Id." });
  }
});


app.get("*", (req, res) => {
  res.render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
