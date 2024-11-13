import {useState, useEffect, useContext} from 'react';
import {useUserInfo} from "../util/userUtil.ts";
import PageHeader from "./PageHeader/PageHeader.tsx";
import {SnackbarContext} from "../util/snackbar.ts";
import {buildUrl} from "../util/api.ts";

function Analyze()
{
    const { firstName: userFirstName, lastName: userLastName, logoutUser: doLogout } = useUserInfo()
    const snackbarController = useContext(SnackbarContext)

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

    function addToSearchEcr(card: any): void
    {
        console.log(card.rank_ecr);
        console.log("Adding: " + (15 - ((card).rank_ecr - 1) * 0.05));
        let newEcr:Number = (15 - (((card).rank_ecr - 1) * 0.05)) + Number(searchEcr);
        handleSearchEcr(newEcr.toFixed(2));
    }

    function handleFromSearch (e: any, card:any)
    {
        // onClick event
        if (e.dataTransfer === undefined)
        {
            setSearchPlayers([...searchPlayersArray, JSON.stringify(card)]);
            addToSearchEcr(card);
            return;
        }

        e.dataTransfer.setData("card", JSON.stringify(card));

        console.log("Starting drag");
        console.log(card);
    }

    function addToRosterEcr(card: any): void
    {
        console.log(card.rank_ecr);
        console.log("Adding: " + (15 - ((card).rank_ecr - 1) * 0.05));
        let newEcr:Number = (15 - (((card).rank_ecr - 1) * 0.05)) + Number(rosterEcr);
        handleRosterEcr(newEcr.toFixed(2));
    }

    function handleFromRoster (e: any, card:any)
    {
        // onClick event
        if (e.dataTransfer === undefined)
        {
            setRosterPlayers([...rosterPlayersArray, JSON.stringify(card)]);
            addToRosterEcr(card);
            return;
        }

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

    function openRosterPlayersUL (event:any) : void
    {
        event.preventDefault();
        const list = event.currentTarget.lastChild;
        let rosterTitle = event.currentTarget.firstChild.innerText;
        rosterTitle = rosterTitle.slice(0, rosterTitle.length - 1);

        console.log(rosterTitle);
        if (list.style.display === "block")
        {
            rosterTitle = rosterTitle + '➤';
            list.style.display = "none";
        }
        else
        {
            rosterTitle = rosterTitle + '⮟';
            list.style.display = "block";
        }
        event.currentTarget.firstChild.innerText = rosterTitle;
    }

    function deletePlayer (e: any, rank_ecr: number, from: string) : void
    {
        e.preventDefault();
        console.log(typeof(rank_ecr));
        e.currentTarget.parentElement.remove();

        if (from === "fromSearch")
        {
            let newEcr:Number = Number(searchEcr) - (15 - (rank_ecr - 1) * 0.05);
            handleSearchEcr(newEcr.toFixed(2));
        }
        else if (from === "fromRoster")
        {
            let newEcr:Number = Number(rosterEcr) - (15 - (rank_ecr - 1) * 0.05);
            handleRosterEcr(newEcr.toFixed(2));
        }
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
            snackbarController.set({ label: "Searching... 🤔" })
            const response = await fetch(buildUrl("api/searchplayer"),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            snackbarController.set({ label: "Search completed 🤓" });
            setResults(res.players);
        }

        catch(error:any)
        {
            snackbarController.set({ label: '❌ Search went wrong...' });
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
            const response = await fetch(buildUrl("api/getrosters"),
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

            {/* Header */}
            <PageHeader
              label="ANALYZE"
              description="Replace this text with a short description"
            />

            <div style={{textAlign:"center"}}className="rainbow-text">
                Net Value: {(Number(searchEcr)-Number(rosterEcr)).toFixed(2)}
            </div>
            <br></br>

            <div className="searchDiv">
                <div><h2> 🔍 Search </h2></div>
                <div>
                    <input type="text" id="searchPlayers" placeholder="Enter player name" onChange={handleSearchText} />
                </div>
                <select className="selectPosition" onChange={handleSearchPosition}>
                    <option value="">--Position--</option>
                    <option>QB</option>
                    <option>WR</option>
                    <option>RB</option>
                    <option>TE</option>
                </select>
                <input type="text" className="searchTeam" placeholder="Team" onChange={handleSearchTeam} />
                <div>
                    <input type="submit" id="searchButton" className="buttons" value = "Submit" onClick={searchPlayers}/>
                </div>

                <div id="searchResults">
                <ul style={{padding: "1px"}}>
                    {searchResults.map((info) => (
                        <li className="card" draggable onDragStart= {(e) => handleFromSearch(e, info)} onClick={(e)=> {handleFromSearch(e, info)}} style={{background: `no-repeat 5% url(${info.player_image_url}), url('../src/assets/field.JPG')`, fontSize: "12px"}}>
                            [{info.player_position_id}, {info.player_team_id}]  {info.player_name}
                        </li>
                    ))}
                </ul>
                </div>
            </div>

            <div className="dragHereDiv">
                <h2> Search Value: {searchEcr} </h2>
                <div className="dragHereBox" onDrop={handleFromSearchDrop} onDragOver={handleDragHere}>
                    {searchPlayersArray.map((card) => (
                        <div className="card" style={{background: `no-repeat 5% url(${JSON.parse(card).player_image_url}), url('../src/assets/field.JPG')`, fontSize: "12px", cursor: "pointer"}}>
                            <button className="deletePlayerButton" onClick={(e)=> deletePlayer(e, JSON.parse(card).rank_ecr, "fromSearch")}>🗑️</button>
                            [{JSON.parse(card).player_position_id}, {JSON.parse(card).player_team_id}]  {JSON.parse(card).player_name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="dragHereDiv">
                <h2> Your Value: {rosterEcr} </h2>
                <div className="dragHereBox" onDrop={handleFromRosterDrop} onDragOver={handleDragHere}>
                    {rosterPlayersArray.map((card) => (
                        <div className="card" style={{background: `no-repeat 5% url(${JSON.parse(card).player_image_url}), url('../src/assets/field.JPG')`, fontSize: "12px", cursor: "pointer"}}>
                            <button className="deletePlayerButton" onClick={(e)=> deletePlayer(e, JSON.parse(card).rank_ecr, "fromRoster")}>🗑️</button>
                            [{JSON.parse(card).player_position_id}, {JSON.parse(card).player_team_id}]  {JSON.parse(card).player_name}
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
                        <div className="roster">
                            <h3 onClick={openRosterPlayersUL} >{roster.RosterName} ➤ </h3>

                            <ul id="rosterPlayers" style={{padding: "1px", display: "none"}}>
                            {roster.players.map((player:any) => (
                                <div className="card" draggable onDragStart= {(e) => handleFromRoster(e, player)} onClick={(e)=> {handleFromRoster(e, player)}} style={{background: `no-repeat 5% url(${player.player_image_url}), url('../src/assets/field.JPG')`, fontSize: "12px"}}>

                                    [{player.player_position_id}, {player.player_team_id}]  {player.player_name}
                                </div>
                            ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <br></br>
        </div>
    );
};

export default Analyze;
