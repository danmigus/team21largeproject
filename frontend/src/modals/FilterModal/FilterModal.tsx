import styles from './styles.module.css'
import Modal from "../Modal/Modal.tsx";
import Button from "../../components/Button/Button.tsx";
import {useContext, useState} from "react";
import {ModalContext} from "../../util/modal.ts";
import {afc, nfc} from "../../util/teams.ts";

interface FilterModalProps {
  initialDivision: string,
  initialTeam: string,
  initialPosition: string,
  updateFilters: (newDivision: string, newTeam: string, newPos: string) => void,
}

export default function FilterModal({ initialDivision, initialTeam, initialPosition, updateFilters }: FilterModalProps) {
  const setModal = useContext(ModalContext)
  const [division, setDivision] = useState<string>(initialDivision)
  const [team, setTeam] = useState<string>(initialTeam)
  const [position, setPosition] = useState<string>(initialPosition)

  return (
    <Modal>
      <h2 style={{ width: '25rem' }}>Search Filters</h2>

      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <div className={styles.filterOption}>
          <span style={{ fontWeight: 'bold' }}>Division</span>
          <select
            value={division}
            onChange={(e) => {
              setDivision(e.target.value)
              setTeam('')
            }}
          >
            <option value="afc">AFC</option>
            <option value="nfc">NFC</option>
          </select>
        </div>

        <div className={styles.filterOption}>
          <span style={{ fontWeight: 'bold' }}>Team</span>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            {(division === 'afc' ? afc : nfc).map((team) => (
              <option value={team.split('/')[0]}> {team.split('/')[1]} </option>
            ))}
          </select>
        </div>

        <div className={styles.filterOption}>
          <span style={{fontWeight: 'bold'}}>Position</span>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="">--Position--</option>
            <option>QB</option>
            <option>WR</option>
            <option>RB</option>
            <option>TE</option>
          </select>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'end', gap: '0.5rem'}}>
        <Button color="white" onClick={() => setModal(null)}>Cancel</Button>
        <Button
          color="white"
          onClick={() => {
            updateFilters(division, team, position)
            setModal(null)
          }}
        >
          Update Filters
        </Button>
      </div>
    </Modal>
  )
}
