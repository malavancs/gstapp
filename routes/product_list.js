var express = require('express');
var mysql = require('mysql');
var router= express.Router();
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b8d752ed02ca14',
    password : '5f1daf91',
    database : 'heroku_136dddc8ce42edf'
});
var app = express();
//create table single_billing (sno int UNIQUE KEY AUTO_INCREMENT,name varchar(50),code varchar(50),price int, gst int,quantity int,date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,bill_id varchar(50));
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");



    } else {
        console.log("Error connecting database ... \n\n"+err);
    }
});



router.get('/getAllProduct',function (request,response,next) {
    connection.query("SELECT *FROM product_list ORDER BY sno ASC",function (err, rows, fields) {
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
router.get('/searchTerm',function (request,response,next) {
    var query = request.query.name;
    var queryString=('SELECT * FROM product_list WHERE name  LIKE \''+query+'%\'');
   connection.query(queryString,function (err,rows,fields) {
       if (err) throw err

       response.setHeader('Content-Type', 'application/json');
       response.send(JSON.stringify(rows[0]));
   });
});

router.post('/addItemToCart',function (request,response,next) {
   var postdata = request.body;
    var name = postdata.name;
    var code = postdata.code;
    var price = Number(postdata.price);
    var gstpercentage =Number(postdata.gst);
    var sessionid = 122;
    var quantity = Number(postdata.quantity);
    var priceTotal=(price)+(price*(gstpercentage/100));

    var queryString = "INSERT INTO SINGLE_BILLING VALUES(NULL,'"+name+"','"+code+"',"+price+","+gstpercentage+","+quantity+",NULL,'"+sessionid+"',"+priceTotal+");";
console.log(queryString);
    connection.query(queryString,function (err,rows,fields) {
        if (err) throw err

        response.setHeader('Content-Type', 'application/json');
        response.send("Suceess");
    });

});


router.get('/getTotalPrice',function (request,response,next) {
   var sessionid = 122;
   var queryString = 'SELECT sum(total_price) as TotalSum from single_billing where bill_id='+sessionid;
    connection.query(queryString,function (err,rows,fields) {
        if (err) throw err

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(rows[0]));
    });

});

router.post('/makeBill',function (request,response,next) {
   var postdata = request.body;
   var totalPrice = Number(postdata.totalprice);
   var billid = postdata.billid;
   var details = postdata.details;
   var queryString = "INSERT INTO SAVED_BILLING VALUES(NULL,NULL,"+totalPrice+",'"+details+"','"+billid+"');";
   console.log(queryString);

    connection.query(queryString,function (err,rows,fields) {
        if (err) throw err

        response.setHeader('Content-Type', 'application/json');
        response.send("Sucess");
    });


});
router.get('/getAllInCart',function (request,response,next) {

//     var querySessionId;

    var  querySessionId=122;



    var queryString = 'SELECT *FROM single_billing where bill_id ='+querySessionId;

    console.log(queryString);

    connection.query(queryString,function (err,rows,fields) {
        if (err) throw err

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(rows));
    });
});



router.get('/billingHistory',function (request,response,next) {
    connection.query("SELECT *FROM saved_billing ORDER BY sno ASC",function (err, rows, fields) {
        if (err) throw err

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(rows));
    })

});
module.exports = router;