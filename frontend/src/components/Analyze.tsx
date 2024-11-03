import { useState } from 'react';


function Analyze()
{
    // Local storage stuff.
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userFirstName:string = ud.firstName;
    let userLastName:string = ud.lastName;

    // Usestate stuff.
    const [message,setMessage] = useState('');
    const [playerName, setSearchText] = useState('');
    const [searchResults,setResults] = useState([
        {
            _id: "",
            player_name: "", 
            player_team_id: "", 
            player_image_url: "", 
            rank_ecr: "", 
            player_position_id: ""
        }
    ]);
    const app_name = 'galaxycollapse.com';

    function buildPath(route:string) : string
    {
        if (process.env.NODE_ENV != 'development')
        {
            return 'https://' + app_name + '/' + route;
        }
        else
        {
            return 'http://localhost:5000/' + route;
        }
    }

    function handleSearchText( e: any ) : void
    {
        setSearchText( e.target.value );
    }

    async function doLogout(event:any) : Promise<void>
    {
        event.preventDefault();

        setMessage("Logging out...");
        localStorage.clear();
        window.location.href = '/';
    }

    async function searchPlayers(event:any) : Promise<void>
    {
        event.preventDefault();

        let obj = {playerName};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath("api/searchplayer"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            var res = JSON.parse(await response.text());

            setMessage("Search completed");
            setResults(res.players);
        }

        catch(error:any)
        {
            setMessage('❌ Search went wrong...');
            alert(error.toString());
            return;
        }
    }

    return(
        <div>
            <h1>Welcome, {userFirstName} {userLastName} 👋😃</h1>
            <input type="submit" id="logoutButton" className="buttons" value = "Logout" onClick={doLogout}/>
            <br></br>
            <div id="result">{message}</div>
            <br></br>

            <span style={{border: "solid 1px", padding:"20px"}}>
                <span>Search</span> 
                <span><input type="text" id="searchPlayers" placeholder="Enter player name" onChange={handleSearchText} /></span>
                <span><input type="submit" id="registerButton" className="buttons" value = "Submit" onClick={searchPlayers}/></span>
            </span>
            <div id="dragHere" style={{border: "dotted 5px", marginLeft:"100%", width: "200px", height: "50px"}}>
                    Drag Here
            </div>

            <div id="searchResults">
                <ul style={{border: "solid 1px"}}>
                    {searchResults.map((info) => (
                    <div draggable style={{border: "solid 2px green", width: "30%", cursor: "grab", padding: "3px"}} key = {info.player_name}>{info.player_name}</div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Analyze;