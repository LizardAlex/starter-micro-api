const http = require('http');
const fs = require('fs');
const path = require('path');

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
    const split = req.url.split("?");
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
	}

	res.setHeader('Content-type', 'application/json');
	res.write(JSON.stringify(statsObject));
	res.end();
});

server.listen(PORT, 'localhost', (error) => {
	error ? console.log(error) : console.log('listening 300');
});