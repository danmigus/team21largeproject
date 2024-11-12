import styles from './styles.module.css'
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import Button from "../../components/Button/Button.tsx";
import {useQuery} from "@tanstack/react-query";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {buildUrl} from "../../util/api.ts";
import PlayerCard from "../../components/PlayerCard/PlayerCard.tsx";

export default function RosterBuilder() {
  // Player search
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchQueryDebounce = useRef<ReturnType<typeof setTimeout>>()

  const { data } = useQuery({
    queryKey: [searchQuery],
    queryFn: async () => {
      if (searchQuery.trim() === '') return []
      const resp = await fetch(buildUrl("api/searchplayer"), {
        method: 'POST',
        body: JSON.stringify({ playerName: searchQuery, position: '', team: '' }),
        headers: {'Content-Type': 'application/json'}
      })
      if (!resp.ok) throw new Error("Could not complete player search")
      return await resp.json()
    },
  })

  const handleSearchTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    clearTimeout(searchQueryDebounce.current)
    setLiveSearchQuery(e.target.value)
    searchQueryDebounce.current = setTimeout(() => {
      setSearchQuery(e.target.value)
    }, 1000)
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
              <input type="text" placeholder="Placeholder" />
              <Button color="white">Add</Button>
            </div>
          </div>
        </div>

        <div className={styles.divider} ></div>

          <div className={styles.builderSide}>
            <div className={styles.sideHeader}>
              <h3>PLAYERS</h3>
              <div className={styles.sideControls}>
                <input type="text" placeholder="Search..." onChange={handleSearchTextInput} />
                <Button color="white">Filters</Button>
              </div>
            </div>

            <div className={styles.sidePlayerList}>
              {data?.players?.map((it) => (
                <PlayerCard
                  playerName={it.player_name}
                  playerImageUrl={it.player_image_url}
                  playerPositionId={it.player_position_id}
                  playerTeamId={it.player_team_id}
                />
              ))}
            </div>
          </div>

      </div>
    </div>
  )
}
