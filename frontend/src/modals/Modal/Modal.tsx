import styles from './styles.module.css'
import {ReactNode} from "react";

interface ModalProps {
  children: ReactNode | ReactNode[] | null,
}

export default function Modal({ children }: ModalProps) {
  return (
    <div className={styles.modalBkg}>
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  )
}
