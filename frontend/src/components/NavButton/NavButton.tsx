import styles from './styles.module.css'
import {useNavigate} from "react-router-dom"
import {useState} from "react"

interface NavButtonProps {
  label: string
  selected: boolean
  destination: string
}

export default function NavButton({ label, selected, destination }: NavButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <button
      className={styles.button}
      onClick={() => navigate(destination)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
      {(selected || isHovered) && <div className={styles.underline} />}
    </button>
  )
}
