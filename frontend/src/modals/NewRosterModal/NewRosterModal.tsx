import styles from './styles.module.css'
import Modal from "../Modal/Modal.tsx";
import {useContext, useEffect, useState} from "react";
import {ModalContext} from "../../util/modal.ts";
import Button from "../../components/Button/Button.tsx";
import TextInput from "../../components/TextInput/TextInput.tsx";
import {useMutation} from "@tanstack/react-query";
import {useUserInfo} from "../../util/userUtil.ts";
import {buildUrl} from "../../util/api.ts";

interface NewRosterModalProps {
  onSuccess: (newRosterName: string) => void,
}

export default function NewRosterModal({ onSuccess }: NewRosterModalProps) {
  const { id: userId } = useUserInfo()
  const setModal = useContext(ModalContext)
  const [rosterName, setRosterName] = useState('')

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: () => {
      return fetch(buildUrl('api/newroster'), {
        method: 'POST',
        body: JSON.stringify({ rosterName, userId }),
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })

  useEffect(() => {
    // Close modal if creation succeeded
    if (isSuccess) {
      onSuccess(rosterName)
      setModal(null)
    }
  }, [isSuccess, onSuccess, rosterName, setModal])

  return (
    <Modal>
      <h2 style={{ width: '20rem' }}>Create Roster</h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>Roster Name</span>
        <TextInput
          placeholder="My Roster"
          value={rosterName}
          onChange={(e) => setRosterName(e.target.value)}
          disabled={isPending || isSuccess}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'end', gap: '0.5rem' }}>
        <Button color="white" onClick={() => setModal(null)} disabled={isPending || isSuccess}>
          Cancel
        </Button>
        <Button color="white" onClick={() => mutate()} disabled={isPending || isSuccess || rosterName.trim() === ''}>
          Create
        </Button>
      </div>
    </Modal>
  )
}
