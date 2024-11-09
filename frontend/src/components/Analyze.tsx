import { useState, useEffect } from 'react';
import {useUserInfo} from "../util/userUtil.ts";

function Analyze()
{
    const { firstName: userFirstName, lastName: userLastName, logoutUser: doLogout } = useUserInfo()

    const userData:any = localStorage.getItem("user_data")
    const userId:string = JSON.parse(userData).id;

    const [rosters, setRosters] = useState<any[]>([
        {
            RosterName: "",
            players: []
        }
    ]);
    useEffect(() => {
        async function mount () {
            try
            {
                const loadedRosters = await loadRosters();
                setRosters(loadedRosters);
            }
            catch(error:any )
            {   
                console.log(error);
            }
        }
        mount();
    },[]);

    const [message,setMessage] = useState('');
    const [playerName, setSearchText] = useState('');
    const [position, setSearchPosition] = useState('');
    const [team, setSearchTeam] = useState('');
    const [searchPlayersArray, setSearchPlayers] = useState<string[]>([]);
    const [rosterPlayersArray, setRosterPlayers] = useState<string[]>([]);
    const [searchEcr, setSearchEcr] = useState('');
    const [rosterEcr, setRosterEcr] = useState('');
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

    function handleSearchEcr( ecr:string ) : void
    {
        setSearchEcr(ecr);
    }

    function handleRosterEcr ( ecr:string ) : void
    {
        setRosterEcr(ecr);
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

    function handleFromSearchDrop (e: React.DragEvent)
    {
        const card = e.dataTransfer.getData("card") as string;
        console.log(card);
        setSearchPlayers([...searchPlayersArray, card]);

        console.log("Adding: " + (15 - ((JSON.parse(card).rank_ecr - 1) * 0.05)).toFixed(2));
        let newEcr:Number = (15 - ((JSON.parse(card).rank_ecr - 1) * 0.05)) + Number(searchEcr);
        handleSearchEcr(newEcr.toFixed(2));
    }

    function handleFromRosterDrop (e: React.DragEvent)
    {
        const card = e.dataTransfer.getData("card") as string;
        console.log(card);
        setRosterPlayers([...rosterPlayersArray, card]);

        console.log("Adding: " + (15 - ((JSON.parse(card).rank_ecr - 1) * 0.05)).toFixed(2));
        let newEcr:Number = (15 - ((JSON.parse(card).rank_ecr - 1) * 0.05)) + Number(rosterEcr);
        handleRosterEcr(newEcr.toFixed(2));
    }

    function hideRosterList ()
    {
        document.getElementById("rosterList")!.style.display = "none";
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

    async function loadRosters() : Promise<any[]>
    {
        let obj = { userId };
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath("api/getrosters"),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            return res.rosters;
        }

        catch (error:any)
        {
            console.log(error.toString());
            return[
                {
                    RosterName: "error",
                    players: []
                }
            ]
        }
    }

    return(
        <div>
            <div id="result">Status: {message}</div>
            <div style={{textAlign:"center"}}className="rainbow-text">You gain: {(Number(rosterEcr)-Number(searchEcr)).toFixed(2)} </div>
            <br></br>
            
            <div className="searchDiv">
                <div><h2> 🔍 Search </h2></div>
                <div><input type="text" id="searchPlayers" placeholder="Enter player name" onChange={handleSearchText} /></div>
                <select className="selectPosition" onChange={handleSearchPosition}>
                    <option value="">--Position--</option>
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
                            <img className="playerImg" alt="[player img]" draggable="false" src={info.player_image_url}></img> [{info.player_position_id}, {info.player_team_id}]  {info.player_name}
                        </li>
                    ))}
                </ul>
                </div>
            </div>

            <div className="dragHereDiv">
                <h2> Search Value: {searchEcr} </h2>
                <div className="dragHereBox" onDrop={handleFromSearchDrop} onDragOver={handleDragHere}>
                    {searchPlayersArray.map((card) => (
                        <div className="card" style={{cursor: "pointer"}}>
                            <img className="playerImg" alt="[player img]" draggable="false" src={JSON.parse(card).player_image_url}></img> [{JSON.parse(card).player_position_id}, {JSON.parse(card).player_team_id}]  {JSON.parse(card).player_name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="dragHereDiv">
                <h2> Your Value: {rosterEcr} </h2>
                <div className="dragHereBox" onDrop={handleFromRosterDrop} onDragOver={handleDragHere}>
                    {rosterPlayersArray.map((card) => (
                        <div className="card" style={{cursor: "pointer"}}>
                            <img className="playerImg" alt="[player img]" draggable="false" src={JSON.parse(card).player_image_url}></img> [{JSON.parse(card).player_position_id}, {JSON.parse(card).player_team_id}]  {JSON.parse(card).player_name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="userRosters">
                <h2>Your Rosters 🏈</h2>
                <br></br>
                <hr></hr>
                <br></br>
                <div id="rosterList">
                    {rosters.map((roster) => (
                        <div className="roster" onClick={hideRosterList}>
                            <h3>{roster.RosterName} ➤ </h3>
                        </div>
                    ))}
                </div>
            </div>
            <br></br>
        </div>
    );
};

export default Analyze;
