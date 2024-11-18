import styles from './styles.module.css'
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import Button from "../../components/Button/Button.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import {buildUrl} from "../../util/api.ts";
import PlayerCard from "../../components/PlayerCard/PlayerCard.tsx";
import {useUserInfo} from "../../util/userUtil.ts";
import {ModalContext} from "../../util/modal.ts";
import NewRosterModal from "../../modals/NewRosterModal/NewRosterModal.tsx";
import SelectRosterModal from "../../modals/SelectRosterModal/SelectRosterModal.tsx";
import FilterModal from "../../modals/FilterModal/FilterModal.tsx";
import TextInput from "../../components/TextInput/TextInput.tsx";

export default function RosterBuilder() {
  const { id: userId } = useUserInfo()
  const setModal = useContext(ModalContext)

  const [curRoster, setCurRoster] = useState<string | null>(null)

  // Player search
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchQueryDebounce = useRef<ReturnType<typeof setTimeout>>()
  const [division, setDivision] = useState('afc')
  const [team, setTeam] = useState('')
  const [position, setPosition] = useState('')
  const [curPage, setCurPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const results:any = useRef([])

  const selectSearchData = useCallback((data:any) => {
    if (data.length === 0 && loadingMore) return results.current.flat()
    if (data.length === 0 && !loadingMore) return []
    if (results.current.length > 0) {
      results.current[curPage] = data.players
    } else {
      results.current = [data.players]
    }
    setLoadingMore(false)
    return results.current.flat()
  }, [curPage, loadingMore])

  const { data: searchData, isPending: isSearchPending, isPlaceholderData } = useQuery({
    queryKey: [searchQuery, team, position, curPage],
    queryFn: async () => {
      if (searchQuery.trim() === '') return []
      const resp = await fetch(buildUrl('api/searchplayer'), {
        method: 'POST',
        body: JSON.stringify({ playerName: searchQuery, position, team, pageIndex: curPage }),
        headers: {'Content-Type': 'application/json'}
      })
      if (!resp.ok) throw new Error('Could not complete player search')
      return await resp.json()
    },
    select: selectSearchData,
    gcTime: 0,
    placeholderData: () => [],
  })

  useEffect(() => {
    setCurPage(0)
    results.current = []
  }, [searchQuery, division, team, position])

  const { data: userRosters, refetch: refetchRosters } = useQuery({
    queryKey: ['userrosters', curRoster, userId],
    queryFn: async () => {
      const resp = await fetch(buildUrl('api/getrosters'), {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {'Content-Type': 'application/json'}
      })
      if (!resp.ok) throw new Error('Could not complete player search')
      return (await resp.json()).rosters
    },
  })
  const curRosterObj = userRosters?.find((it:any) => it.RosterName === curRoster)

  const { mutate: addPlayerToRoster } = useMutation({
    mutationFn: (player: string) => {
      return fetch(buildUrl('api/addtoroster'), {
        method: 'POST',
        body: JSON.stringify({ userId, rosterId: curRosterObj.RosterId, playerId: player }),
        headers: { 'Content-Type': 'application/json' }
      })
    },
    onSuccess: () => {
      // Refresh roster on success
      setTimeout(() => refetchRosters(), 100)
    }
  })

  const { mutate: removePlayerFromRoster } = useMutation({
    mutationFn: (playerId: string) => {
      return fetch(buildUrl('api/removefromroster'), {
        method: 'POST',
        body: JSON.stringify({ userId, rosterId: curRosterObj.RosterId, playerId }),
        headers: { 'Content-Type': 'application/json' }
      })
    },
    onSuccess: () => {
      // Refresh roster on success
      setTimeout(() => refetchRosters(), 100)
    }
  })

  const handleSearchTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    clearTimeout(searchQueryDebounce.current)
    setLiveSearchQuery(e.target.value)
    searchQueryDebounce.current = setTimeout(() => {
      setSearchQuery(e.target.value)
      searchQueryDebounce.current = -1 as ReturnType<any>
    }, 1000)
  }

  const openCreateRosterModal = () => {
    setModal(
      <NewRosterModal
        onSuccess={(newRosterName) => {
          setCurRoster(newRosterName)
          setTimeout(() => refetchRosters(), 100)
        }}
      />
    )
  }

  const openSelectRosterModal = () => {
    setModal(<SelectRosterModal rosters={userRosters} setRoster={setCurRoster} />)
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <PageHeader
        label="ROSTER BUILDER"
        description="Form or edit a roster with new players"
      />

      {/* Builder */}
      <div className={styles.builderContainer}>
        <div className={styles.builderSide}>
          <div className={styles.sideHeader}>
            <h3>ROSTER</h3>
            <div className={styles.sideControls}>
              <span style={{ fontWeight: 'bold' }}>{curRoster}</span>
              <Button color="white" onClick={openSelectRosterModal}>Switch Roster</Button>
              <Button color="white" onClick={openCreateRosterModal}>Create</Button>
            </div>
          </div>

          {/* User has no rosters */}
          {userRosters?.length === 0 && (
            <div className={styles.noRostersContainer}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>You currently have no rosters!</span>
              <span style={{ color: '#ffffffcc', paddingBottom: '1rem'}}>Create a new one below</span>
              <Button
                color="white"
                onClick={openCreateRosterModal}
              >
                Create Roster
              </Button>
            </div>
          )}

          {/* User has rosters, but none selected */}
          {(userRosters?.length > 0 && !curRoster) && (
            <div className={styles.noRostersContainer}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>You don't have a roster selected!</span>
              <span style={{ color: '#ffffffcc', paddingBottom: '1rem'}}>Select one below</span>
              <Button
                color="white"
                onClick={openSelectRosterModal}
              >
                Select Roster
              </Button>
            </div>
          )}

          {/* Roster is selected, but no players */}
          {curRosterObj?.players.length === 0 && (
            <div className={styles.noRostersContainer}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>You don't have any players in this roster!</span>
              <span style={{ color: '#ffffffcc', paddingBottom: '1rem'}}>Find players to your right ➡️</span>
            </div>
          )}

          {/* Regular view - roster selected with players */}
          {curRosterObj?.players.length > 0 && (
            <div className={styles.sidePlayerList}>
              {curRosterObj.players.map((it:any) => (
                <PlayerCard
                  playerName={it.player_name}
                  playerImageUrl={it.player_image_url}
                  playerPositionId={it.player_position_id}
                  playerTeamId={it.player_team_id}
                >
                  <Button
                    color="white"
                    onClick={() => {
                      removePlayerFromRoster(it._id)
                    }}
                  >
                    Remove
                  </Button>
                </PlayerCard>
              ))}
            </div>
          )}

        </div>

        <div className={styles.divider} />

          <div className={styles.builderSide}>
            <div className={styles.sideHeader}>
              <h3>PLAYERS</h3>
              <div className={styles.sideControls}>
                <TextInput type="text" placeholder="Search..." value={liveSearchQuery} onChange={handleSearchTextInput} />
                <Button
                  color="white"
                  onClick={() => setModal(
                    <FilterModal
                      initialDivision={division}
                      initialTeam={team}
                      initialPosition={position}
                      updateFilters={(div, team, pos) => {
                        setDivision(div)
                        setTeam(team)
                        setPosition(pos)
                      }}
                    />)}
                  stretch
                >
                  Filters
                </Button>
              </div>
            </div>

            {/* Empty search */}
            {liveSearchQuery.trim() === '' && (
              <div className={styles.noRostersContainer}>
                <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>You're not searching for anything!</span>
                <span style={{color: '#ffffffcc', paddingBottom: '1rem'}}>Begin your search above ⬆️</span>
              </div>
            )}

            {/* Search query but no results */}
            {(liveSearchQuery.trim() !== '' && searchData?.length === 0 && liveSearchQuery === searchQuery && !isPlaceholderData) && (
              <div className={styles.noRostersContainer}>
                <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>Your search came up blank!</span>
                <span style={{color: '#ffffffcc', paddingBottom: '1rem'}}>Try searching for someone else</span>
              </div>
            )}

            {/* Search results present */}
            {(liveSearchQuery.trim() !== '' && liveSearchQuery === searchQuery && (!isSearchPending || loadingMore) && searchData?.length !== 0) && (
              <>
                <div className={styles.sidePlayerList}>
                  {searchData?.map((it:any) => (
                    <PlayerCard
                      key={it._id}
                      playerName={it.player_name}
                      playerImageUrl={it.player_image_url}
                      playerPositionId={it.player_position_id}
                      playerTeamId={it.player_team_id}
                    >
                      <Button
                        color="white"
                        onClick={() => addPlayerToRoster(it._id)}
                        disabled={!curRoster}
                      >
                        Add
                      </Button>
                    </PlayerCard>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                  <Button
                    color="white"
                    onClick={() => {
                      setCurPage(curPage + 1)
                      setLoadingMore(true)
                    }}
                  >
                    Load More...
                  </Button>
                </div>
              </>
            )}

          </div>

      </div>
    </div>
  )
}