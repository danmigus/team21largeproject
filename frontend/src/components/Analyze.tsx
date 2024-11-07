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
    const [playerCard, setPlayerCards] = useState<string[]>([]);
    const [ecr, setEcr] = useState('');
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

    function handleEcr( ecr:string ) : void
    {
        setEcr(ecr);
    }

    function handleSearchPosition ( e: any ) : void
    {
        setSearchPosition (e.target.value);
    }

    function handleSearchTeam ( e : any ) : void
    {
        setSearchTeam (e.target.value);
    }

    function handleDragHere (e: React.DragEvent)
    {
        e.preventDefault();
    }

    function handleDrag (e: React.DragEvent, card:any)
    {
        e.dataTransfer.setData("card", JSON.stringify(card));
        console.log("Starting drag");
        console.log(card);
    }

    function handleDrop (e: React.DragEvent)
    {
        const card = e.dataTransfer.getData("card") as string;
        console.log(card);
        setPlayerCards([...playerCard, card]);

        console.log("Adding: " + (15 - ((JSON.parse(card).rank_ecr - 1) * 0.05)).toFixed(2));
        let newEcr:Number = (15 - ((JSON.parse(card).rank_ecr - 1) * 0.05)) + Number(ecr);
        handleEcr(newEcr.toFixed(2));
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
        let revealResults = document.getElementById("searchResults") as HTMLDivElement;
        revealResults.style.display = "block";

        let obj = {playerName, position, team};
        let js = JSON.stringify(obj);

        try
        {
            setMessage("Searching... 🤔")
            const response = await fetch(buildPath("api/searchplayer"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            setMessage("Search completed 🤓");
            setTimeout(() => {
                setMessage("");
            }, 2000);
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

            <div className="selectDiv">
                <div>Search: </div>
                <div><input type="text" id="searchPlayers" placeholder="Enter player name" onChange={handleSearchText} /></div>
                <select className="selectPosition" onChange={handleSearchPosition}>
                    <option value=""> Position </option>
                    <option>QB</option>
                    <option>WR</option>
                    <option>RB</option>
                    <option>TE</option>
                </select>
                <input type="text" className="searchTeam" placeholder="Team" onChange={handleSearchTeam} />

                <div><input type="submit" id="searchButton" className="buttons" value = "Submit" onClick={searchPlayers}/></div>

                <div id="searchResults">
                <ul style={{padding: "1px"}}>
                    {searchResults.map((info) => (
                        <li className="card" draggable onDragStart= {(e) => handleDrag(e, info)}>
                            [{info.player_position_id}, {info.player_team_id}] <img className="playerImage" alt="[player img]" draggable="false" src={info.player_image_url}></img> {info.player_name}
                        </li>
                    ))}
                </ul>
                </div>
            </div>


            <div className="dragHereDiv">
                <h2> Total ECR: {ecr} </h2>

                <div className="dragHereBox" onDrop={handleDrop} onDragOver={handleDragHere}>
                    {playerCard.map((card) => (
                        <div className="card" style={{cursor: "pointer"}}>
                            [{JSON.parse(card).player_position_id}, {JSON.parse(card).player_team_id}] <img className="playerImg" alt="[player img]" draggable="false" src={JSON.parse(card).player_image_url}></img> {JSON.parse(card).player_name}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Analyze;
