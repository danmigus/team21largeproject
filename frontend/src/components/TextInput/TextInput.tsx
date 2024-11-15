import styles from './styles.module.css'
import {DetailedHTMLProps, InputHTMLAttributes} from "react";

export default function TextInput({ ...all }: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input
      type="text"
      className={styles.textbox}
      {...all}
    />
  )
}
