function addToSearchEcr(card: any, searchEcr: any): string
{
    console.log(card.rank_ecr);
    console.log("Adding: " + (15 - ((card).rank_ecr - 1) * 0.05));
    let newEcr:Number = (15 - (((card).rank_ecr - 1) * 0.05)) + Number(searchEcr);
    return newEcr.toFixed(2);
}

function handleFromSearch (e: any, card:any) : any
{
    let searchPlayersArray: Array<string> = [];

    if (e === undefined)
    {
        searchPlayersArray = [...searchPlayersArray, JSON.stringify(card)];
        console.log("mock add to searchEcr");
        console.log(searchPlayersArray);
        return searchPlayersArray;
    }
    console.log("Starting drag");
    console.log(card);
}

function deletePlayer (e: any, rank_ecr: number, from: string) : string
{
    console.log(e);
    console.log(typeof(rank_ecr));

    if (from === "fromSearch" || from === "fromRoster")
    {
        let newEcr:Number = 100 - (15 - (rank_ecr - 1) * 0.05);
        return newEcr.toFixed(2);
    }

    return "noFrom";
}

export {addToSearchEcr, handleFromSearch, deletePlayer}