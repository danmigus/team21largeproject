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
    const [position, setSearchPosition] = useState('');
    const [team, setSearchTeam] = useState('');
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

    function handleSearchPosition ( e: any ) : void
    {
        setSearchPosition (e.target.value);
    }

    function handleSearchTeam ( e : any ) : void
    {
        setSearchTeam (e.target.value);
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

        let obj = {playerName, position, team};
        let js = JSON.stringify(obj);

        try
        {
            setMessage("Searching... 🤔")
            const response = await fetch(buildPath("api/searchplayer"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            var res = JSON.parse(await response.text());

            setMessage("Search completed 🤓");
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

            <div style={{border: "solid 1px", padding:"20px", float: "left"}}>
                <div>Search: </div> 
                <div><input type="text" id="searchPlayers" placeholder="Enter player name" onChange={handleSearchText} /></div>
                <select style={{float: "left"}} onChange={handleSearchPosition}>
                    <option value=""> Position </option>
                    <option>QB</option>
                    <option>WR</option>
                    <option>RB</option>
                    <option>TE</option>
                </select>
                <input style={{float: "left", height: "10px", width: "100px"}} type="text" id="searchTeam" placeholder="Team" onChange={handleSearchTeam} />

                <div><input type="submit" id="registerButton" className="buttons" value = "Submit" onClick={searchPlayers}/></div>

                <div id="searchResults" style={{float: "left"}}>
                <ul style={{border: "solid 1px", padding: "1px"}}>
                    {searchResults.map((info) => (
                        <li draggable style={{border: "solid 2px green", cursor: "grab", padding: "3px", margin:"2px"}} >
                            [{info.player_position_id}, {info.player_team_id}] <img alt="[player img]" style={{width: "10%"}} src={info.player_image_url}></img> {info.player_name}
                        </li>
                    ))}
                </ul>
                </div>
            </div>



            <div id="dragHere" style={{border: "dotted 5px", width: "200px", height: "500px", float: "left", textAlign: "center"}}>
                <h4>Drag Here</h4>
            </div>


        </div>
    );
};

export default Analyze;