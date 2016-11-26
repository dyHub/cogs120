/**
 * Created by yuhan on 11/25/16.
 */

var fs = require("fs");

exports.view = function(req, res){
    console.log("Hola");
    var beachID = req.params.id;
    // console.log(data);

    fs.readFile("./public/json/reviewBeaches.json", 'ascii', function(err, data) {
        console.log(err);
        console.log(data);
        data = JSON.parse(data);


        data.push({"name": process.env.user, "description": req.query.description});
        console.log(data);
        fs.writeFile("./public/json/reviewBeaches.json", JSON.stringify(data), function(err){
            console.log(err);
            res.writeHead(302, {
                'Location': '/new/review/' + beachID
            });
            res.end();
        });

    });
};