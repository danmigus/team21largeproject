import {addToSearchEcr, handleFromSearch, deletePlayer} from './FunctionsToTest.tsx'

describe ('various analyze functions', () => {

  test ('should output a string that does not exceed a certain length', () =>
  {
    let defaultValue = 0;
    let flag = false;
    const card = {rank_ecr: Math.random()}
    const result = addToSearchEcr(card, defaultValue)
    expect(typeof result).toBe('string');

    // Rounding should not exceed 2
    if (result.split('.')[1].length > 2)
    {
      flag = true;
    }
    expect(flag).toBe(false);
  });

  test ('card object should add to string array', () =>
    {
      let card = { dummy: "value" }
      const result = handleFromSearch(undefined, card);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });
  
    test ('card deletion should update ecr', () =>
      {
        const searchEcr = Math.random();
        expect(typeof deletePlayer(undefined, searchEcr , "fromRoster")).toBe('string');
        expect(typeof deletePlayer(undefined, searchEcr , "fromSearch")).toBe('string');
        expect(deletePlayer(undefined, searchEcr , "dummy")).toBe("noFrom");
      });
});

