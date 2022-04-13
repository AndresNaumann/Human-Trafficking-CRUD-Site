// Author: Andrew Naumann
// Program Description: This is a human trafficking information website made using node.js and express.

// Import all the packages that will be used in the project like express and path.
let port = process.env.PORT || "8081";
let hostname = process.env.RDS_HOSTNAME || "127.0.0.1";
let rds_port = process.env.RDS_PORT || "5432";
let rds_db_name = "trafficked_children";
let rds_username = process.env.RDS_USERNAME || "postgres";
let rds_password = process.env.RDS_PASSWORD || "Jewish66";

const express = require("express");
let app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/"));

const knex = require("knex")({
  client: "pg",
  connection: {
    host: hostname,
    user: rds_username,
    password: rds_password,
    database: rds_db_name,
    port: rds_port,
  },
});

// This creates a route so that the site can be accessed at localhost
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/addperson", (req, res) => {
  res.render("addperson");
});

app.post("/addperson", (req, res) => {
  let sFirstName = req.body.first_name;
  let sLastName = req.body.last_name;
  let iAge = req.body.age_at_missing;
  let dateMissing = req.body.date_missing;
  let sCity = req.body.city;
  let sState = req.body.state;
  let sGender = req.body.gender;
  let sRace = req.body.race;

  knex("people")
    .insert({
      date_missing: dateMissing,
      last_name: sLastName,
      first_name: sFirstName,
      age_at_missing: iAge,
      city: sCity,
      state: sState,
      gender: sGender,
      race: sRace,
    })
    .then((results) => {
      res.redirect("/displaypeople");
    });
});

app.get("/displaypeople", (req, res) => {
  knex
    .select()
    .from("people")
    .then((result) => {
      res.render("displaypeople", { aPeople: result });
    });
});

app.get("/edit/:personid", (req, res) => {
  knex
    .select()
    .from("people")
    .where("person_id", req.params.personid)
    .then((result) => {
      res.render("editperson", { aPeople: result });
    });
});

app.post("/edit/:personid", (req, res) => {
  knex("people")
    .where("person_id", req.params.personid)
    .update({
      date_missing: req.body.date_missing,
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      age_at_missing: req.body.age_at_missing,
      city: req.body.city,
      state: req.body.state,
      gender: req.body.gender,
      race: req.body.race,
    })
    .then((result) => {
      res.redirect("/displaypeople");
    });
});

app.get("/delete/:personid", (req, res) => {
  knex("people")
    .where("person_id", req.params.personid)
    .del()
    .then((result) => {
      res.redirect("/displaypeople");
    });
});

app.listen(port, () => console.log("Port is " + port));
