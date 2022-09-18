const path = require("path");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { json } = require("body-parser");
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "faculty_Scheduling",
});

connection.connect(function (error) {
  if (!!error) console.log(error);
  else console.log("Database Connected!");
});

//set views file
app.set("views", path.join(__dirname, "views"));

//set view engine
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname));

// see Home Page

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/New_User", (req, res) => {
  res.render("Ragistration");
});

// Add new User

app.post("/Add", (req, res) => {
  let data = {
    S_Name: req.body.name,
    S_Email: req.body.email,
    S_Address: req.body.address,
    S_Mobile_Number: req.body.phone_no,
  };
  let sql = "INSERT INTO Ragistration SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Admin Login in to Page
app.post("/auth", function (request, response) {
    // Capture the input fields
    var username = request.body.name;
    var password = request.body.password;
    connection.query("SELECT * FROM admin WHERE Admin_Name = ? AND Admin_Password = ?", [username, password], function (error, results, fields) {
        if (results.length > 0) {
            response.redirect("Course");
        } else {
            connection.query("SELECT * FROM ragistration WHERE Email = ? AND Password = ?", [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    response.redirect("/Faculty_Course_view");
                } else {
                    connection.query("SELECT * FROM student WHERE Email = ? AND Password = ?", [username, password], function (error, results, fields) {
                        if (results.length > 0) {
                            response.redirect("/Stude_Course");
                        } else {
                            response.redirect("/");
                        }
                    });
                }
            
                            
            });
        }
    });
});

// Add Course Into List

app.post("/Add_Course", (req, res) => {
  let data = { course: req.body.course, description: req.body.description };
  let sql = "INSERT INTO courses SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("Course");
  });
});

// View Course In to Course page

app.get("/Course", (req, res) => {
  let sql = "SELECT * FROM courses";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Course", {
      users: rows,
    });
  });
});

// Edit Course in course list
app.get("/C_edit/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from courses where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("Course_Edit", {
      user: result[0],
    });
  });
});

//  update course in course list

app.post("/C_update", (req, res) => {
  const userId = req.body.id;
  let sql =
    "update courses SET course='" +
    req.body.course +
    "',  description='" +
    req.body.description +
    "' where id =" +
    userId;
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/Course");
  });
});

//  delete course from course list
app.get("/C_delete/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from courses where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/Course");
  });
});

//faculty form
app.get("/Faculty", (req, res) => {
  res.render("Faculty_Form");
});

// faculty add in data base
app.post("/Faculty_Add", (req, res) => {
  let data = {
    First_Name: req.body.firstname,
    Middle_Name: req.body.middlename,
    Last_Name: req.body.lastname,
    Contact: req.body.contact,
    Gender: req.body.gender,
    Address: req.body.address,
    Email: req.body.email,
    Password: req.body.password,
  };
  let sql = "INSERT INTO ragistration SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.render("index");
  });
});

// Faculty view in admin page 
app.get("/Faculty_View", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM ragistration";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Faculty_View", {
      title: "CRUD Operation using NodeJS / ExpressJS / MySQL",
      users: rows,
    });
  });
});
// Faculty Edit by admin 
app.get("/F_edit/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from ragistration where F_Id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("Faculty_Edit", {
      user: result[0],
    });
  });
});
// Faculty update by admin
app.post("/F_Update", (req, res) => {
  const userId = req.body.id;
  let sql =
    "update ragistration SET First_Name ='" +
    req.body.firstname +
    "', Middle_Name = '" +
    req.body.middlename +
    "', Last_Name ='" +
    req.body.lastname +
    "', Contact = '" +
    req.body.contact +
    "', Gender ='" +
    req.body.gender +
    "', Address = '" +
    req.body.address +
    "', Email = '" +
    req.body.email +
    "', Password = '" +
    req.body.password +
    "' where F_Id = " +
    userId;
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/Faculty_View");
  });
});

//  delete faculty from Admin list
app.get("/F_delete/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from ragistration where F_Id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/Faculty_View");
  });
});

// Student Form
app.get("/Student", (req, res) => {
  res.render("Student_Form");
});

//Student Add in data base
app.post("/Student_Add", (req, res) => {
  let data = {
    S_First_Name: req.body.firstname,
    S_Middle_Name: req.body.middlename,
    S_Last_Name: req.body.lastname,
    Contact: req.body.contact,
    Gender: req.body.gender,
    Address: req.body.address,
    Email: req.body.email,
    Password: req.body.password,
  };
  let sql = "INSERT INTO student SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.render("index");
  });
});

// Student View in Admin Page 
app.get("/Student_View", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM student";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Student_View", {
      users: rows,
    });
  });
});

// student Edit by Admin
app.get("/S_edit/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from student where S_id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("Student_Edit", {
      user: result[0],
    });
  });
});

//Student Update By Admin
app.post("/S_update", (req, res) => {
  const userId = req.body.id;
  let sql =
    "update student SET S_First_Name ='" +
    req.body.firstname +
    "', S_Middle_Name = '" +
    req.body.middlename +
    "', S_Last_Name ='" +
    req.body.lastname +
    "', Contact = '" +
    req.body.contact +
    "', Gender ='" +
    req.body.gender +
    "', Address = '" +
    req.body.address +
    "', Email = '" +
    req.body.email +
    "', Password = '" +
    req.body.password +
    "' where S_id = " +
    userId;
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/Student_View");
  });
});

//  delete Student from Admin list
app.get("/S_delete/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from student where S_id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/Student_View");
  });
});

// student can see course list
app.get("/Stude_Course", (req, res) => {
  let sql = "SELECT * FROM courses";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Stude_Course", {
      users: rows,
    });
  });
});
// Student Faculty View list
app.get("/Stude_Faculty_View", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM ragistration";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Stude_Faculty_View", {
      users: rows,
    });
  });
});

//faculty course list view
app.get("/Faculty_Course_view", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM courses";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Faculty_Course_view", {
      users: rows,
    });
  });
});

//faculty side faculty view
app.get("/Faculty_Faculty_view", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM ragistration";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Faculty_Faculty_view", {
      users: rows,
    });
  });
});



app.get("/Calendar", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM faculty_Scheduling.events";
  let query = connection.query(sql, (err,results) => {
    if (err) throw err;
    results.forEach(events => {
                //i think this is where we have take some varialbes and store the input from the server and display it using html but how to send it to script.js?
                // dsic = events.Description
                // techname = events.Name
                // dat = events.date
                // console.log(events.Description);
                // console.log(dsic);
                // console.log(techname);
                // console.log(dat);
                
            });
    res.render("Calendar");
  });
});
app.get("/fcalendar", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM faculty_Scheduling.events";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    results.forEach((events) => {
      //i think this is where we have take some varialbes and store the input from the server and display it using html but how to send it to script.js?
      // dsic = events.Description
      // techname = events.Name
      // dat = events.date
      // console.log(events.Description);
      // console.log(dsic);
      // console.log(techname);
      // console.log(dat);
    });
    res.render("faculty_calendar");
  });
});
app.get("/scalendar", (req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM faculty_Scheduling.events";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    results.forEach((events) => {
      //i think this is where we have take some varialbes and store the input from the server and display it using html but how to send it to script.js?
      // dsic = events.Description
      // techname = events.Name
      // dat = events.date
      // console.log(events.Description);
      // console.log(dsic);
      // console.log(techname);
      // console.log(dat);
    });
    res.render("student_calendar");
  });
});

// app.get("/home", (req, res) => {
//    res.statusCode == 200;
//    res.setHeader("Content-Type", "application/json");

//    connection.query(
//      "SELECT * FROM faculty_Scheduling.events",
//      function (error, results, fields) {
//        if (error) throw error;

//        var comments = JSON.stringify(results);

//        res.end(comments);
//      }
//    );

//    conn.end();
// })
 
// app.use(bodyParser.json());
// app.post("/Add1", (req, res) => {
//   res.setHeader("Content-Type:", "application/json");
//   if (err) throw err;
//   let comments = JSON.stringify(results);
//   console.log(comments);
//   // let data = { Description: req.body.Description, Name: req.body.Name, date: req.body.date };
//   let sql = "INSERT INTO events SET ?";
//   let query = connection.query(sql, data, (err, results) => {
//     if (err) throw err;
//     res.redirect("Course");
//   });
// });

 
app.post("/inset", (req, res) => {

  alert("helloke;ejkje");
         res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        let content = '';
        req.on('data', function (data) {
            content += data;
            let obj = JSON.parse(content);
            
            // console.log(data);


            // console.log("The Event description  is: "+ obj.description);
            // console.log("The Teacher name  is: "+ obj.name);
            // console.log("The date   is: "+ obj.Date);


            // let query = connection.query('INSERT INTO events (Description,Name,date) VALUES (?,?,?)', [obj.description, obj.name, obj.Date], function (error, results, fields) {
            //     if (error) throw error;
            //     // console.log("Success!");
            // });

          
           let data1 = {
             Description: req.body.description,
             Name: req.body.name,
             date: req.body.Date,
           };
           let sql = "INSERT INTO events SET ?";
           let query = connection.query(sql, data, (err, results) => {
             if (err) throw err;
             res.redirect("hello");
           });
          
            connection.end();
            res.end("Success!");
        });

    }

    )
//     //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
app.delete("/delete", (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')

        let content = '';
        req.on('data', function (data) {
            content += data;
            // console.log("###"+content);

            let obj = JSON.parse(content)
            // console.log("***"+obj.clicked);
            let conn2 = con.getConnection()
            let mukesh = `DELETE FROM faculty_Scheduling.events WHERE date=?`;
            // conn2.query("DELETE FROM pepcalender.events WHERE date = spotify ")
            conn2.query(mukesh, obj.clicked)
            conn2.end();
            res.end("Success!");
        });
    })

// Server Listening
app.listen(4000, () => {
  console.log("Server is running at port 4000");
});
