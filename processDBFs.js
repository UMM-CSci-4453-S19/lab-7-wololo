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