import {useContext} from "react";
import {ModalContext} from "../../util/modal.ts";
import Modal from "../Modal/Modal.tsx";
import Button from "../../components/Button/Button.tsx";
import {UserRoster} from "../../ApiTypes.ts";

interface SelectRosterModalProps {
  rosters: UserRoster[]
  setRoster: (name: string) => void
}

export default function SelectRosterModal({ rosters, setRoster }: SelectRosterModalProps) {
  const setModal = useContext(ModalContext)

  return (
    <Modal>
      <h2 style={{ width: '25rem' }}>Select Roster</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {rosters.map((roster) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold' }}>{roster.RosterName}</span>
              <span style={{ fontSize: '0.75rem', color: '#FFFFFFCC'}}>
                {`${roster.players.length} player${roster.players.length === 1 ? '' : 's'}`}
              </span>
            </div>
            <Button
              color="white"
              onClick={() => {
                setRoster(roster.RosterName)
                setModal(null)
              }}
            >
              Select
            </Button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button color="white" onClick={() => setModal(null)}>Cancel</Button>
      </div>
    </Modal>
  )
}
