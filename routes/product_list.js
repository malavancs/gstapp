var express = require('express');
var mysql = require('mysql');
var router= express.Router();
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'GST_BILLING_APP'
});
var app = express();

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});



router.get('/getAllProduct',function (request,response,next) {
    connection.query("SELECT *FROM product_list",function (err, rows, fields) {
        if (err) throw err

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(rows));
    })
});


router.post('/addProduct',function (request,response,next) {
   var postdata = request.body;
   console.log(postdata);
   var name = postdata.name;
   var code = postdata.code;
   var price = postdata.price;
   var gstpercentage =postdata.gst;
   var ss ="INSERT INTO product_list values(NULL,'"+name+"','"+code+"','"+price+"','"+gstpercentage+"')";

   console.log(ss);
   connection.query(ss,function (err,rows,fields) {
       if (err) response.status(400).send("Failed to add");
        else
       response.status(200).send("Done");
   });

  //  response.send(postdata);

});
module.exports = router;