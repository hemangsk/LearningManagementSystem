const connection = require("../config/mysql");
const async = require('async');
const config = require("../config/config");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const upload_path = 'server/data/';



module.exports = {
  login: function (req, res) {

    let login = req.body.login;
    let password = req.body.password;

    let query = "SELECT * FROM usict_student_2014 WHERE enrollment_no=? AND password=?";

    console.log(query);

    connection.query(query, [ login, password ], function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(results);

      var user = results[0];

      var token = jwt.sign({ id: user.enrollment_no }, config.secret, {});

      res.status(200).send({ auth: true, token: token });
    });
  },

  dashboard: function(req, res) {

    let id = req.userId;
    var semester = req.body.semester;

    // get batch

    var get_course_query = "SELECT * FROM usict_student_2014 WHERE enrollment_no=?";

    connection.query(get_course_query, [id], function(err, results) {
      if (err) return;

      var user = results[0];
      var course = user.course;
      var stream = user.stream;

      var get_batch_query = "SELECT batch_id FROM usict_batch_allocation WHERE course=? AND stream=? AND semester=?";

      connection.query(get_batch_query, [course, stream, semester], function(err, results) {
        if (err) return;

        var batch_id = results[0].batch_id;

        // get subjects and faculty data
        
        var get_subjects_query = "SELECT * FROM usict_subject_allocation WHERE batch_id=?";

        connection.query(get_subjects_query, [batch_id], function(err, results) {
          if (err) return;

          // get instructor names

          var promises = [];

          results.forEach(function(subject, index){
            var get_instructor_query = "SELECT * FROM employee WHERE instructor_id=?";
            promises.push(function(callback) {
              connection.query(get_instructor_query, [subject.instructor_code], function(err, instructor) {
                if (err) return;
                results[index].instructor = instructor[0].name;
                callback(null, subject);
              })
            });
          })


        
          async.parallel(promises, function(err, result) {
            if (err) return console.log(err);

            // return subjects data
            return res.json( { 'subjects' : result, 'user' : user });
          });

        })

      })
    })


  },

  assignments: function (req, res) {

    let feedback_id = req.body.feedback_id;

    // get assignments

    var get_assignments_query = "SELECT * FROM usict_assignments WHERE feedback_id=?";

    connection.query(get_assignments_query, [feedback_id], function(err, results) {
      if (err) return;

      res.json(results);
    })
  },

  submissions: function (req, res) {
    // find user
    let id = req.userId;

    var assignment = req.body.assignment;
    console.log(assignment);
    if (req.body['content']) {
    
      var fileData = req.body['content'].split(",");

      var fileType = fileData[0];
      var fileContent = fileData[1];
      switch (fileType) {
        case 'data:application/pdf;base64' : {
          fs.writeFile(upload_path + assignment['assignment_id'] + '_' + assignment['feedback_id'] 
          + '_' + id + '.pdf', fileContent , {encoding: 'base64'}, function(err) {
            updateSubmissions();
          });

          break;
        }

        case 'data:image/png;base64' : {
          fs.writeFile('server/data/' + assignment['assignment_id'] + '_' + assignment['feedback_id'] 
          + '_' + id + '.png', fileContent , {encoding: 'base64'}, function(err) {
            updateSubmissions();
          });

          break;
        }

        default : {
          break;
        }
      }
    } else {
      updateSubmissions();
    }


    function updateSubmissions() {
      var check_submission = 'SELECT * FROM usict_submissions WHERE assignment_id=? AND enrollment_no=?'

      connection.query(check_submission, [assignment['assignment_id'], id], function(err, results) {
        if (err) console.log(err);
  

        if (results.length == 0) {
          var insert_submission_query = "INSERT INTO usict_submissions(assignment_id, notes, date_of_submission,enrollment_no, feedback_id) VALUES(?,?,?,?,?)";
          connection.query(insert_submission_query, [assignment['assignment_id'], assignment['notes'], Date.now(), id, assignment['feedback_id']], function(err, response) {
            if (err) return;
      
            res.json({result: response});
          })
          
        } else {
          console.log(results);

          let submission_id = results[0]['submission_id'];

          var update_submission_query = "UPDATE usict_submissions SET notes = ?, date_of_submission = ? WHERE submission_id = ?"

          connection.query(update_submission_query, [assignment['notes'], Date.now(), submission_id], function(err, response) {
            if (err) return;
      
            res.json({result: response})
          })

        }
      })

    }

  },

  getSubmissions : function(req, res) {
    let id = req.userId;
    let feedback_id = req.body.feedback_id

    var fetch_submissions_query = "SELECT * FROM usict_submissions WHERE feedback_id = ? AND enrollment_no = ?";

    connection.query(fetch_submissions_query, [feedback_id, id], function(err, submissions) {
      if (err) return;


      var promises = [];

      submissions.forEach(function(submission, index){
        var get_assignment_query = "SELECT * FROM usict_assignments WHERE assignment_id=?";
        promises.push(function(callback) {
          connection.query(get_assignment_query, [submission['assignment_id']], function(err, assignment) {
            if (err) return;
            submissions[index].assignment = assignment[0];
            callback(null, assignment);
          })
        });
      })

      async.parallel(promises, function(err, result) {
        if (err) return console.log(err);

        // return submissions data
        return res.json( { 'submissions' : submissions });
      });


    });
  },

  deleteSubmission: function(req, res) {
    let id = req.userId;

    let sid = req.body.sid;

    let fid = req.body.fid;

    let aid = req.body.aid;

    var delete_query = 'DELETE FROM usict_submissions WHERE submission_id = ? AND enrollment_no = ?';
    connection.query(delete_query, [sid, id], function(err, response) {
      if (err) {
        console.log(err);

      }


      // TODO : Add proper handler
      
      fs.unlink(upload_path + aid + '_' + fid + '_' + id + '.png', function(err) {
        if (err) return;
      })

      fs.unlink(upload_path + aid + '_' + fid + '_' + id + '.pdf', function(err) {
        if (err) return;
      })


      res.json({ status: response });
    })

  },

  viewSubmissions: function(req, res) {
    let id = req.userId;
    let sid = req.body.id;


    var get_submission_data = "SELECT assignment_id, feedback_id FROM usict_submissions WHERE submission_id = ?";

    connection.query(get_submission_data, [sid], function(err, response) {
      if (err) {
        console.log(err);

      }

      var aid = response[0].assignment_id;
      var fid = response[0].feedback_id;

      fs.readdir(upload_path, (err, files) => {
        files.forEach(file => {
          
          if (file.indexOf(aid + '_' + fid + '_' + id) > -1) {
            readFile(file);
          }
        });
      })

    })

    function readFile(file) {
      fs.readFile(upload_path + file, function read(err, data) {
        if (err) {
            throw err;
        }
        content = data.toString('base64');
        
        // add extension 

        var extension = file.split(".")[1];

        switch(extension) {
          case 'png' : {

            content = 'data:image/png;base64,' + content;
            break;
          }

          case 'pdf' : {
            content = 'data:application/pdf;base64,' + content;
            break;
          }

          default : break;

        }

        res.json({content: content});
      });
    }
  }

}
