const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
}); 
// const userController = (req, res) =>{
//     res.render('home')
// }
// module.exports = {userController}

exports.view =(req, res) =>{
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
        }
    connection.query("SELECT * FROM user WHERE status = 'active'", (err, rows) =>{
        connection.release();
    if(!err){
        let removedUser = req.query.removed;
        res.render('home', {rows, removedUser})
    } else {
        console.log(err);
    }
    //   console.log("The data form user tabble: \n", rows);
    })
 })
}

//find/search user
exports.find = (req, res) => {
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
        }
        let searchTerm = req.body.search
        // % prevents bad data
    connection.query("SELECT * FROM user WHERE firstName LIKE ? OR lastName LIKE ?", ['%' + searchTerm + '%','%' + searchTerm + '%'], (err,rows) => {
        connection.release();
    if(!err){
        res.render("home", {rows})
    } else{
        console.log(err)
    }
    // console.log("The data form user tabble: \n", rows);
    })
 });
}
//click add-user button to navigate to the createUserForm page
exports.form = (req, res) => {
    res.render('add-user')
}

//ADD NEW USER FORM
exports.createUserForm = (req,res) => {
    //getting the data from the body
    const {firstName, lastName, email, phone, comments} = req.body
        // Validate required fields
    if (!firstName || !lastName) {
        return res.status(400).send("First name and last name are required.");
    }
//       if (!firstName || !lastName || !email || !phone) {
//     // If validation fails, render the form again with the user's entered data
//     return res.render("add-user", {
//       formData: { firstName, lastName, email, phone, comments },
//       error: "All fields are required."
//     });
//   }
    pool.getConnection((err, connection) => { 
        if (err) {
         console.error("Error connecting to MySQL:", err);
        //  return res.status(500).send("Database connection error.");
        return res.render("add-user", { formData: req.body, error: "Error saving data." });
        }

        //Check if a user with the same email or phone already exists
        const checkDuplicateQuery = "SELECT * FROM user WHERE email = ? OR phone = ?";
        connection.query(checkDuplicateQuery, [email, phone], (err, rows) => {
            if (err) {
                console.error("Error checking for duplicates:", err);
                return res.render("add-user", { alert: "Error occurred. Please try again." });
            }
            if(rows.length > 0) {
            return res.render("add-user", { formData: req.body, alert: "User with this email or phone already exists." });
          }
        })
     //  connection.query("INSERT INTO user SET firstName = ?, lastName = ?", [firstName, lastName], (err,rows) => {
       const sql = "INSERT INTO user (firstName, lastName, email, phone, comments) VALUES(?, ?, ?, ?, ?)";
        connection.query(sql, [firstName, lastName, email, phone, comments], (err,rows) => {
            connection.release();
                if (err) {
                    console.error("Error executing query:", err);
                    return res.status(500).send("Error saving user to the database.");
                }
                res.render('add-user', {alert: `${firstName} added successfully!` })

                //console.log("The data form user table: \n", rows)
            })
    })
}

//edit user
exports.editUser = (req, res) => {
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
        }
    connection.query("SELECT * FROM user WHERE id = ? ",[req.params.id], (err, rows) =>{
        connection.release();
    if(!err){
        res.render('edit-user', {rows})
    } else {
        console.log(err);
    }
    //   console.log("The data form user tabble: \n", rows);
    })
 })
}

//update-user
exports.updateUser = (req,res) => {
    const {firstName, lastName, email, phone, comments} = req.body
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
        }
      connection.query("UPDATE user SET firstName = ?, lastName = ?, email =?, phone = ?, comments = ? WHERE id = ?", [firstName, lastName,email, phone,comments, req.params.id], (err,rows) => {
        connection.release();
    if(!err){
        res.render('edit-user',{alert: `${firstName} Updated successfully`})
    } else {
        console.log(err);
    }
    })
 })
}

//delete 
exports.getdeleteUser = (req, res) => {
    const userId = req.params.id;
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
            return res.status(500).send("Database connection error.");
        }
        connection.query("SELECT * FROM user WHERE id = ?", [userId], (err, rows) => {
            if (err) {
                console.log("Error fetching user:", err);
                connection.release();
                return res.status(500).send("Error fetching user details.");
            }
            // If the user exists, show the delete confirmation page
            if (rows.length > 0) {
                res.render("delete",{rows});
            } 
        })
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
            return res.status(500).send("Database connection error.");
        }
                // Proceed to delete the user if confirmed
         connection.query("DELETE FROM user WHERE id = ?", [userId], (err) => {
              connection.release(); // Release the connection after both queries
                   if (err) {
                        console.log("Error deleting user:", err);
                        return res.status(500).send("Error deleting user.");
                    }
                    res.render("delete", { alert: "User details deleted successfully"});
             });
        });
};

//view One User
exports.viewOneUser = (req, res) => {
    pool.getConnection((err, connection) => { 
        if (err) {
            console.error("Error connecting to MySQL:", err);
        }
    connection.query("SELECT * FROM user WHERE id = ? ", [req.params.id], (err, rows) =>{
        connection.release();
    if(!err){
        res.render('view-oneUser', {rows})
    } else {
        console.log(err);
    }
    })
 })
}

   //completley deleting from the database
// exports.deleteUser = (req, res) => {
//     pool.getConnection((err, connection) => { 
//         if (err) {
//             console.error("Error connecting to MySQL:", err);
//         }
//     connection.query("DELETE FROM user WHERE id = ? ",[req.params.id], (err, rows) =>{
//         connection.release();
//     if(!err){
//         // res.render('home', {rows})
//         res.redirect('/')
//     } else {
//         console.log(err);
//     }
//     //   console.log("The data form user tabble: \n", rows);
//     })
//  })
// }

//not deleting from the database but removing, from the frontend but still in the record.
// exports.deleteUser = (req, res) => {
//     pool.getConnection((err, connection) => { 
//         if (err) {
//             console.error("Error connecting to MySQL:", err);
//         }
//     connection.query("UPDATE user SET status = ? WHERE id = ? ", ["removed", req.params.id], (err, rows) =>{
//         connection.release();
//     if(!err){
//         let removedUser = encodeURIComponent('User Successfully removed.')
//         // res.render('home', {rows})
//         res.redirect('/?removed='+removedUser);
//     } else {
//         console.log(err);
//     }
//     //   console.log("The data form user tabble: \n", rows);
//     })
//  })
//}