import styles from './styles.module.css'
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import Button from "../../components/Button/Button.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ChangeEvent, useContext, useRef, useState} from "react";
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
  const searchQueryDebounce = useRef<ReturnType<typeof setTimeout> | null>()

  const { data: searchData, isPending: isSearchPending } = useQuery({
    queryKey: [searchQuery],
    queryFn: async () => {
      if (searchQuery.trim() === '') return []
      const resp = await fetch(buildUrl('api/searchplayer'), {
        method: 'POST',
        body: JSON.stringify({ playerName: searchQuery, position: '', team: '' }),
        headers: {'Content-Type': 'application/json'}
      })
      if (!resp.ok) throw new Error('Could not complete player search')
      return await resp.json()
    },
  })

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
  const curRosterObj = userRosters?.find((it) => it.RosterName === curRoster)

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
      searchQueryDebounce.current = null
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
              {curRosterObj.players.map((it) => (
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
                <Button color="white" onClick={() => setModal(<FilterModal />)} stretch>Filters</Button>
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
            {(liveSearchQuery.trim() !== '' && searchData?.players?.length === 0 && liveSearchQuery === searchQuery) && (
              <div className={styles.noRostersContainer}>
                <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>Your search came up blank!</span>
                <span style={{color: '#ffffffcc', paddingBottom: '1rem'}}>Try searching for someone else</span>
              </div>
            )}

            {/* Search results present */}
            {(liveSearchQuery.trim() !== '' && !isSearchPending && liveSearchQuery === searchQuery) && (
              <div className={styles.sidePlayerList}>
                {searchData?.players?.map((it) => (
                  <PlayerCard
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
            )}

          </div>

      </div>
    </div>
  )
}
