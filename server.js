const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const secretKey = process.env.SECRET_KEY;
const sendGridKey = process.env.SENDGRID;

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

const {ObjectId} = require('mongodb');

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

async function sendEmail (req, res, next) {

  const { email, tokenUrl } = req.body;
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(sendGridKey);
  const msg = 
  {
    to: email, // Change to your recipient
    from: 'cop4331team22@gmail.com', // Change to your verified sender
    subject: 'Verify your Trade Wizard Account',
    text: "Some text",
    html: tokenUrl,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}


app.post('/api/newroster', async (req, res, next) =>{

  //incoming: userId, rosterName
  //outgoing: error

  const { userId, rosterName } = req.body; 

  const newRoster = {RosterName:rosterName,UserId:userId,players:[]}; 
  var error = ''; 

  try
  {
    const db = client.db();
    const result = db.collection('Rosters').insertOne(newRoster); 
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error}; 
  res.status(200).json(ret); 

}); 

app.post('/api/addtoroster', async (req, res, next) =>
  {
      //incoming: userId, rosterId, playerId
      //outgoing: error
      
      const { userId, rosterId, playerId }= req.body; 
      let error = ''; 

      try
      {

        const db = client.db();

        const result = await db.collection('Rosters').updateOne(
          {_id: new ObjectId(rosterId), UserId:userId},
          {$push:{players:playerId} }

        ); 

        if(result.matchedCount === 0){
          error = "This roster does not exist."; 
        }


      }
      catch(e)
      {
        error = e.toString(); 
      }

      const ret = {error:error}; 
      res.status(200).json(ret); 
  
  
});
    
  app.post('/api/removefromroster', async (req, res, next) =>
    {
      //incoming: userId, rosterId, playerId
      //outgoing: error
      
      const { userId, rosterId, playerId }= req.body; 
      let error = ''; 

      try
      {

        const db = client.db();

        const result = await db.collection('Rosters').updateOne(
          {_id: new ObjectId(rosterId), UserId:userId},
          {$pull:{players:playerId} }

        ); 

        if(result.matchedCount === 0){
          error = "This roster does not exist."; 
        }


      }
      catch(e)
      {
        error = e.toString(); 
      }

      const ret = {error:error}; 
      res.status(200).json(ret); 
  
  
});

app.post('/api/getrosters', async (req, res, next) => {

  // Incoming: userId
  // Outgoing: list of rosters with player data or error

  const { userId } = req.body;
  let error = '';
  let rostersData = [];

  try 
  {

    const db = client.db();

    const rosters = await db.collection('Rosters').find({ UserId: userId }).toArray();

    if (!rosters || rosters.length === 0) {
      error = "No rosters found for this user";
    } else {
    
      rostersData = await Promise.all(
        rosters.map(async (roster) => {
          const playerObjectIds = roster.players.map(id => new ObjectId(id));

          const players = await db.collection('Players').find({
            _id: { $in: playerObjectIds }
          }).toArray();

          return {
            RosterName: roster.RosterName,
            players: players
          };

        })

      );

    }

  } catch (e) 
  {
    error = e.toString();
  }

  const ret = { error: error, rosters: rostersData };
  res.status(200).json(ret);
});

app.post('/api/searchplayer', async (req, res, next) => {

  // incoming: search, optional position, optional team
  // outgoing: playersData, error

  let { playerName, position, team } = req.body;
  let error = ''; 
  let playersData = [];

  try
  {
    if (!playerName) playerName = '';
    const db = client.db();

    // Build the search query with conditional filters
    let query = {
      player_name: { $regex: playerName, $options: 'i' }
    };

    // Add position and team filters if specified
    if (position) {
      query.player_position_id = position;
    }
    if (team) {
      query.player_team_id = team;
    }

    playersData = await db.collection('Players').find(query).project({
      player_name: 1, 
      player_team_id: 1, 
      player_image_url: 1, 
      rank_ecr: 1, 
      player_position_id: 1
    }).toArray();

    if (playersData.length === 0) {
      error = "There are no players matching the search criteria.";
    }
  }
  catch(e)
  {
    error = e.toString(); 
  }

  const ret = { error: error, players: playersData }; 
  res.status(200).json(ret); 
});

app.post('/api/resend', async (req, res, next) =>
  {
    const { email } = req.body;

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ email }, `${secretKey}`, { expiresIn: '15m'});
    console.log("New encoded token:" + token);
    const tokenUrl = `https://galaxycollapse.com/api/verify?token=${token}`;

    req.body = { email: email, tokenUrl: tokenUrl};
    await sendEmail(req, res);

    var error = '';
  
    try
    {
      const db = client.db(); 
      
      const updateToken = await db.collection('Users').updateOne({Email: email}, {$set: {Token: token}})
  
      error = "Updated Token";
    }
    catch(e)
    {
      error = e.toString(); 
    }

    var ret = { error : error };
    res.status(200).json(ret);  

  });

app.post('/api/register', async (req, res, next) =>
  {
    
    // incoming: login, password, firstName, lastName, email
    // outgoing: error 

    const { us, pass, f, l , em} = req.body; 

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ em }, `${secretKey}`, { expiresIn: '15m'});
    console.log("Encoded token:" + token);
    const tokenUrl = `https://galaxycollapse.com/api/verify?token=${token}`;

    let verificationFlag = false;

    const newUser = {Login:us,Password:pass,FirstName:f,LastName:l, Email:em, Token: token, VerificationFlag: verificationFlag}; 
    var error = '';

    req.body = {email: em, tokenUrl: tokenUrl};
    await sendEmail(req, res);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(em)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    try
    {

      const db = client.db(); 
      
      const existingUser = await db.collection('Users').findOne({
        $or: [{ Login: us }, { Email: em }]
      });
  
      if (existingUser) {
        error = 'Username or email already exists';
      } else {
        // Insert new user if no duplicates found
        await db.collection('Users').insertOne(newUser); 
      }

    }
    catch(e)
    {

      error = e.toString(); 

    }

    var ret = { error : error };
    res.status(200).json(ret);  

  });

app.get('/api/verify', async (req, res, next) =>
  {
    var error = '';
	  const jwt = require('jsonwebtoken');
    try
    {
      const db = client.db(); 

      const decodedToken = jwt.verify(req.query.token, secretKey);
      
      if (req.query.passwordReset ===  "yes")
      {
        // resetPasswordSuccess is the page where user sets new pass.
        const updatePasswordToken = await db.collection('Users').updateOne({Email: decodedToken.email}, {$set: {PasswordReset: true}})
        console.log("Redirecting user to set password...");
        res.redirect('https://galaxycollapse.com/setpassword');
      }
      else
      {
        const changeFlag = await db.collection('Users').updateOne({Email: decodedToken.email}, {$set: {VerificationFlag: true}})
        console.log("Redirecting user to login...");
        res.redirect('https://galaxycollapse.com');
      }
      error = 'Successfully verified';
    }

    catch(e)
    {
      error = e.toString(); 
      console.error("Failed token verification");
    }
  
    //var ret = { error:error};
  });
  
app.post('/api/resetpassword', async (req, res, next) =>
{
  var error = '';
  const { email } = req.body;
  const jwt = require('jsonwebtoken');
  try
  {
    const db = client.db();

    const token = jwt.sign({ email }, `${secretKey}`, { expiresIn: '15m'});
    console.log("Encoded token:" + token);
    const tokenUrl = `https://galaxycollapse.com/api/verify?token=${token}&passwordReset=yes`;
    await sendEmail(req, res);
    const updatePasswordToken = await db.collection('Users').updateOne({Email: email}, {$set: {PasswordReset: false}})
  }

  catch(e)
  {
     error = e.toString();
     console.error(error);
  }

  var ret = { error : error };
  res.status(200).json(ret);  
});

app.post('/api/setpassword', async (req, res, next) =>
  {
    var error = '';
    const { email, newPassword } = req.body;
    const jwt = require('jsonwebtoken');
    try
    {
      const db = client.db(); 
      
      const results = await db.collection('Users').find({Email: email}).toArray();

      if (results[0].PasswordReset === true )
      {
        const updatePassword = await db.collection('Users').updateOne({Email: email}, {$set: {Password: newPassword, PasswordReset: false}})
        e = 'Password reset complete';
      }
      else
        e = 'Password reset flag is not set';
    }

    catch(e)
    {
       error = e.toString();
       console.error(error);
    }
  
    var ret = { error : error };
    res.status(200).json(ret);  
  });

app.post('/api/login', async (req, res, next) => 
{
  var error = '';
  console.log(req.body);
  const { login, password } = req.body;
  const db = client.db();

  try
  {
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

    if (results[0].VerificationFlag === false)
      id = -1;

  }
  catch(e)
  {
    error = e.toString(); 
  }

  var ret = { id:id, email:em, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
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
      const { player_name, player_team_id, player_position_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_position_id,
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
      const { player_name, player_team_id, player_position_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_position_id,
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
      const { player_name, player_team_id, player_position_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_position_id,
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
      const { player_name, player_team_id, player_position_id, player_image_url, rank_ecr } = player;

      // Use updateOne with upsert: true to replace or insert each player
      await db.collection('Players').updateOne(
        { player_name, player_team_id },  // Find players by name and team ID
        {
          $set: {
            player_name,
            player_team_id,
            player_position_id,
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

  

