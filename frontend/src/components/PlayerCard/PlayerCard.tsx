import styles from './styles.module.css'
import {ReactNode} from "react";

interface PlayerCardProps {
  playerName: string,
  playerTeamId: string,
  playerImageUrl: string,
  playerPositionId: string,
  children: ReactNode | ReactNode[]
}

export default function PlayerCard({ playerName, playerTeamId, playerImageUrl, playerPositionId, children }: PlayerCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardSide}>
        <img src={playerImageUrl}/>
        <div className={styles.playerDetails}>
          <span>{playerName}</span>
          <span style={{color: '#ffffffcc', fontSize: '1rem'}}>{`${playerPositionId} - ${playerTeamId}`}</span>
        </div>
      </div>
      <div className={styles.cardSide}>
        {children}
      </div>
    </div>
  )
}
