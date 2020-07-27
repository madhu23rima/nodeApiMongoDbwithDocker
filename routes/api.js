// Full Documentation - https://docs.turbo360.co
const express = require('express')
const router = express.Router();

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;



const url = 'mongodb://localhost:27017';

router.get('/users', async (req, res) => {
	console.log('ENV :' + process.env.MONGO_URL);
	const client = await getDBClient();
	let dbUsers = {};
	try {

		dbUsers = await getUsers(client);	
	}
	catch (e) {
		console.log(e);
	}
	finally {
		client.close();
	}
	res.json(dbUsers);

})

router.post('/user', async function (req, res) {

	const client = await getDBClient();
	let user = {...req.body};	
	const { id } = user;
	delete user.id;

	try {
		await upsertUser(client, id, user)
	}
	catch (e) {
		console.log(e);
	}
	finally {
		client.close();
	}
	res.send(user);
})
router.delete('/user/:id', async function (req,res){
	const client = await getDBClient();
	const id = req.params.id;	
	try {		
		await deleteUser(client, id)
	}
	catch (e) {
		console.log('error in deletion')
		console.log(e);
	}
	finally {
		client.close();
	}
	res.send(id);
})

async function getDBClient() {
	//const client = await MongoClient.connect(url, { useNewUrlParser: true })
	const client = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true })
		.catch(err => { console.log(err); });

	if (!client) {
		res.json({ error: 'Connection could not be established' })
	} else {
		console.log('connection successful')
	}
	return client;

}
async function upsertUser(client, id, user) {
	await client.db("lockdown").collection("users").updateOne({ _id: new ObjectID(id)  },
		{$set: {name: user.name,location: user.location, age: user.age, address: user.address}} ,
		{upsert: true });
}
async function getUsers(client) {
	const result = await client.db("lockdown").collection("users").find({})
		.toArray();
	return result;
}

async function deleteUser(client, id){
	const result = await client.db("lockdown").collection("users").deleteOne({ _id: new ObjectID(id)});
	console.log( 'deletion successful');
}


router.get('/:resource', (req, res) => {
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		query: req.query // from the url query string
	})
})

router.get('/:resource/:id', (req, res) => {
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		id: req.params.id,
		query: req.query // from the url query string
	})
})


module.exports = router