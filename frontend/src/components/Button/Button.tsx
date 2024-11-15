import styles from './styles.module.css'
import {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode} from "react";
import clsx from "clsx";

interface ButtonProps {
  color: 'white',
  stretch?: boolean
  onClick: () => void,
  children: ReactNode,
}

export default function Button({ color, onClick, stretch = false, children, ...rest }: ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button
      className={clsx({
        [styles.button]: true,
        [styles.white]: color === 'white',
        [styles.stretch]: stretch
      })}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
