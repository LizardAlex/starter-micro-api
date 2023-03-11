const http = require('http');
const fs = require('fs');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('example.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT, amount INTEGER)");


    db.run("INSERT INTO lorem (info, amount) VALUES ('Zalue2p', 150)");


    db.each("SELECT rowid AS id, info, amount FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info + " " + row.amount);
    });
});

//db.close();





var statsObject = {};

if (fs.existsSync('./stat.json')) {
	fs.readFile('./stat.json', 'utf8', (error, data) => {
        statsObject = JSON.parse(data);
	});
}

const PORT = 3000;
const server = http.createServer((req, res) => {
	console.log('server request');
	console.log(req.url, req.method);
/*    const split = req.url.split("?");
	if (split[1]) {
		const split1 = split[0].split("=");
		const split2 = split[1].split("=");
		if (split1[1] && split2[1]) {
			if (!statsObject[split1[1]]) statsObject[split1[1]] = {};
			if (!statsObject[split1[1]][split2[1]]) statsObject[split1[1]][split2[1]] = 0;
			statsObject[split1[1]][split2[1]] += 1;
			fs.writeFile('./stat.json', JSON.stringify(statsObject), (error) => {
				error ? console.log(error) : null;
			});
		}
	}*/
	db.run(`INSERT INTO lorem (info, amount) VALUES ('Zalue2p', ${Math.floor(Math.random() * 150)})`);


	res.setHeader('Content-type', 'application/json');
	let str = '';
//	db.serialize(() => {
    db.each("SELECT rowid AS id, info, amount FROM lorem", (err, row) => {
        str += row.id + ": " + row.info + " " + row.amount;
    }, () => {
	    res.write(str);
	    res.end();
    });

	//});
	//db.close();
    


	
	//res.write(JSON.stringify(statsObject));
	
});

server.listen(PORT, 'localhost', (error) => {
	error ? console.log(error) : console.log('listening 300');
});