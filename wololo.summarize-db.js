var credentials = require('./credentials.json');
var mysql = require("mysql");
credentials.host = "ids";
var connection = mysql.createConnection(credentials);

connection.connect(function(err){
    if(err) {
        console.log("Problems with MySQL: " + err);
    } else {
        console.log("Connected to database");
    }
});

connection.query('SHOW DATABASES', function(err, rows, fields) {
    if(err) {
        console.log("Error looking up databases");
    } else {
        console.log("Returned values were ", rows);
    }
});

connection.end()
console.log("All done now");

function processDBFs(dbfs){ // Asynchronous row handler
    for(var index in dbfs){
        var dbf = dbfs[index].Database;
        var sql = 'SHOW TABLES IN '+dbf;
        data[dbf] = Number.POSITIVE_INFINITY; //Exists, but not set.
        connection.query(sql, (function(dbf){
            return function(err,tables,fields){
                if(err){
                    console.log('Error finding tables in dbf '+ dbf);
                    connection.end();
                } else {
                    processTables(tables,dbf);
                }
            };
        })(dbf));
    } // do NOT put a connection.end() here.  It will kill all queued queries.
}


function processTables(tables,dbf){ // Asynchronous row handler
    data[dbf] = tables.length; // Now it is set.
    processed[dbf] = 0;        // And has not yet been used as a label.
    for(var index in tables){
        var tableObj = tables[index];
        for(key in tableObj){
            var table = tableObj[key];
            table = dbf+"."+table;
            var sql = 'DESCRIBE '+table;
            connection.query(sql, (function(table,dbf){
                return function(err,desc,fields){
                    if(err){
                        console.log('Error describing table '+ table);
                    } else {
                        processDescription(desc,table,dbf);
                    }
                };
            })(table,dbf));
        }
    }
}