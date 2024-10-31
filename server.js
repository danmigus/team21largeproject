const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const ourTime = new Date().toLocaleTimeString("en-US", {timeZone: 'America/New_York'});
console.log("Server restarted: " + ourTime);
console.error("Server restarted: " + ourTime);

const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.chijf.mongodb.net/SampleMERN?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(url);
client.connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
  {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
  });
  
app.listen(5000); // start Node + Express server on port 5000 ////

app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error
  
  const { userId, card } = req.body;

  const newCard = {Card:card,UserId:userId};
  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
  {
    
    // incoming: login, password, firstName, lastName, email
    // outgoing: error 

    const { us, pass, f, l , em, token} = req.body; 
    const c = require('crypto');
    let generatedToken = c.randomBytes(16).toString("hex");

    const newUser = {Login:us,Password:pass,FirstName:f,LastName:l, Email:em, Token: generatedToken}; 
    var error = '';
    
    try
    {

      const db = client.db(); 
      const result = db.collection('Users').insertOne(newUser); 

    }
    catch(e)
    {

      error = e.toString(); 

    }

    var ret = { error : error };
    res.status(200).json(ret);  

  });
  

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  
  var error = '';

  const { login, password } = req.body;

  const db = client.db();
  const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

  var id = -1;
  var fn = '';
  var ln = '';
  var em = '';
  

  if( results.length > 0 )
  {
    //id = results[0].UserId;
    fn = results[0].FirstName;
    ln = results[0].LastName;
    em = results[0].Email;
    id = results[0]._id;
  }

  var ret = { id:id, email:em, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/addtoroster', async (req, res, next) =>
{
    


});
  
app.post('/api/removefromroster', async (req, res, next) =>
{
 
  

});

app.post('/api/searchplayer', async (req, res, next) =>
{



});

app.post('/api/addplayers', async (req, res) => 
{
  var error = '';  
  try {

    const response = await fetch('https://api.fantasypros.com/public/v2/json/nfl/2024/consensus-rankings?position=QB&scoring=PPR', {
      method: 'GET',
      headers: {
        'x-api-key': 'MW2mJnL2eRaWnZ84Gfvg89vjErgFL11h1aDU2AYE',
      }

    }); 

    const playerData = await response.json(); 
    const players = playerData.players; 
    
    const db = client.db(); 
    
    for (const player of players) {
      const { player_name, player_team_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_image_url,
            rank_ecr
          }
        },
        { upsert: true }
      );
    }

    const response2 = await fetch('https://api.fantasypros.com/public/v2/json/nfl/2024/consensus-rankings?position=WR&scoring=PPR', {
      method: 'GET',
      headers: {
        'x-api-key': 'MW2mJnL2eRaWnZ84Gfvg89vjErgFL11h1aDU2AYE',
      }

    }); 

    const playerData2 = await response2.json(); 
    const players2 = playerData2.players; 
        
    for (const player of players2) {
      const { player_name, player_team_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_image_url,
            rank_ecr
          }
        },
        { upsert: true }
      );
    }

    const response3 = await fetch('https://api.fantasypros.com/public/v2/json/nfl/2024/consensus-rankings?position=RB&scoring=PPR', {
      method: 'GET',
      headers: {
        'x-api-key': 'MW2mJnL2eRaWnZ84Gfvg89vjErgFL11h1aDU2AYE',
      }

    }); 

    const playerData3 = await response3.json(); 
    const players3 = playerData3.players; 
        
    for (const player of players3) {
      const { player_name, player_team_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_image_url,
            rank_ecr
          }
        },
        { upsert: true }
      );
    }

    const response4 = await fetch('https://api.fantasypros.com/public/v2/json/nfl/2024/consensus-rankings?position=TE&scoring=PPR', {
      method: 'GET',
      headers: {
        'x-api-key': 'MW2mJnL2eRaWnZ84Gfvg89vjErgFL11h1aDU2AYE',
      }

    }); 

    const playerData4 = await response4.json(); 
    const players4 = playerData4.players; 
        
    for (const player of players4) {
      const { player_name, player_team_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_image_url,
            rank_ecr
          }
        },
        { upsert: true }
      );
    }
    
    
  }catch(e){

    error = e.toString(); 

  }

  var ret = { error : error };
  res.status(200).json(ret); 

});


  
app.post('/api/searchcards', async (req, res, next) => 
  {
    // incoming: userId, search
    // outgoing: results[], error
  
    var error = '';
  
    const { userId, search } = req.body;
  
    var _search = search.trim();
    
    const db = client.db();
    const results = await db.collection('Cards').find({Card:{$regex:_search+'.*', $options:'i'}, UserId:userId}).toArray();
    
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
      _ret.push( results[i].Card );
    }
    
    var ret = {results:_ret, error:error};
    res.status(200).json(ret);
  });
  
  

