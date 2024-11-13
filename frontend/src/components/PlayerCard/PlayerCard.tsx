import styles from './styles.module.css'
import {ReactNode} from "react";

interface PlayerCardProps {
  playerName: string,
  playerTeamId: string,
  playerImageUrl: string,
  playerPositionId: string,
  children: ReactNode | ReactNode[]
}

export default function PlayerCard({ playerName, playerTeamId, playerImageUrl, playerPositionId}: PlayerCardProps) {
  return (
    <div className={styles.card}>
      <img src={playerImageUrl} />
      <span>{playerName}</span>
    </div>
  )
}
