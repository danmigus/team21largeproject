import styles from './styles.module.css'

interface PageHeaderProps {
  label: string,
  description: string,
}

export default function PageHeader({ label, description }: PageHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerBkg}>
        <div className={styles.header}>
          <h2>{label}</h2>
        </div>
      </div>
      <p>{description}</p>
    </div>
  )
}
