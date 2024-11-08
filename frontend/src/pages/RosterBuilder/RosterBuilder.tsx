import styles from './styles.module.css'
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import Button from "../../components/Button/Button.tsx";

export default function RosterBuilder() {
  return (
    <div className={styles.page}>

      {/* Header */}
      <PageHeader
        label="ROSTER BUILDER"
        description="Form or edit a roster with new players"
      />

      {/* Builder */}
      <div className={styles.builderContainer}>
        <div className={styles.builderSide}>
          <div className={styles.sideHeader}>
            <h3>ROSTER</h3>
            <div className={styles.sideControls}>
              <input type="text" placeholder="Placeholder" />
              <Button color="white">Add</Button>
            </div>
          </div>
        </div>

        <div className={styles.divider} ></div>

        <div className={styles.builderSide}>
          <div className={styles.builderSide}>
            <div className={styles.sideHeader}>
              <h3>PLAYERS</h3>
              <div className={styles.sideControls}>
                <input type="text" placeholder="Search..." />
                <Button color="white">Filters</Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
