var con = require("../config/mysql");
var async = require('async');


module.exports = {
  index: function (req, res) {
    console.log(req);
    res.json({});
  }
}
