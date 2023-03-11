const http = require('http');
const fs = require('fs');
const path = require('path');
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("ruby-elated-pigeonCyclicDB")



const run = async function(game, event, res){
    let animals = db.collection('playables')


    let item = await animals.get(game)
    // create an item in collection with key "leo"
    if (!item || !item.props[event]) {
	    const obj = {};
	    obj[event] = 1;
	    let leo = await animals.set(game, obj);
    } else {
	    const obj = {};
	    obj[event] = item.props[event] + 1;
	    let leo = await animals.set(game, obj);
    }


    res.write(JSON.stringify(item));
    //res.statusCode = 400;
	res.end();
}

const run2 = async function(res){
	let animals = db.collection('playables')
	let all = await animals.list();
	for (let i = 0; i < all.results.length; i += 1) {
		let leo = await animals.get(all.results[i].key);
		res.write(JSON.stringify(leo));
	}
    res.setHeader('Content-Type', 'application/json');
    //res.statusCode = 400;
	res.end();
}


//run();



	var statsObject = {};
	const PORT = 3000;
const server = http.createServer((req, res) => {



    const split = req.url.split("?");

	if (split[1]) {
		const split1 = split[0].split("=");
		const split2 = split[1].split("=");
		if (split1[1] && split2[1]) {
			if (!statsObject[split1[1]]) statsObject[split1[1]] = {};
			if (!statsObject[split1[1]][split2[1]]) statsObject[split1[1]][split2[1]] = 0;
			statsObject[split1[1]][split2[1]] += 1;
			item = run(split1[1], split2[1], res);
		}
	}

    if (req.url === '/') {
	  fs.readFile('./index.html', (err, data) => {
	    if (err) {
	      console.log(err);
	      res.statusCode = 500;
	      res.end();
	    } else {
	      res.write(data);
	      res.end();
	    }
	  });

    	//run2(res);
    }
    if (req.url === '/stat') {
    	run2(res);
    }



	
	//res.write(JSON.stringify(statsObject));
	
});

server.listen(PORT, 'localhost', (error) => {
	error ? console.log(error) : console.log('listening 3000');
});