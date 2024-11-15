import styles from './styles.module.css'
import Modal from "../Modal/Modal.tsx";
import Button from "../../components/Button/Button.tsx";
import {useContext} from "react";
import {ModalContext} from "../../util/modal.ts";

export default function FilterModal() {
  const setModal = useContext(ModalContext)

  return (
    <Modal>
      <h2 style={{ width: '25rem' }}>Search Filters</h2>

      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <div className={styles.filterOption}>
          <span style={{ fontWeight: 'bold' }}>Division</span>
          <input type="text" placeholder="Placeholder"/>
        </div>

        <div className={styles.filterOption}>
          <span style={{ fontWeight: 'bold' }}>Team</span>
          <input type="text" placeholder="Placeholder"/>
        </div>

        <div className={styles.filterOption}>
          <span style={{fontWeight: 'bold'}}>Position</span>
          <input type="text" placeholder="Placeholder"/>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'end', gap: '0.5rem'}}>
        <Button color="white" onClick={() => setModal(null)}>Cancel</Button>
        <Button color="white" onClick={() => {}}>Update Filters</Button>
      </div>
    </Modal>
  )
}
