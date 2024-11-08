import styles from './styles.module.css'
import {ReactNode} from "react";
import clsx from "clsx";

interface ButtonProps {
  color: 'white',
  onClick: () => void,
  children: ReactNode,
}

export default function Button({ color, onClick, children }: ButtonProps) {
  return (
    <button
      className={clsx({
        [styles.button]: true,
        [styles.white]: color === 'white',
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
