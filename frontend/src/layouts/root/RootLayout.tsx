import styles from './styles.module.css'
import {Outlet, useLocation} from "react-router-dom";
import NavButton from "../../components/NavButton/NavButton.tsx";

export default function RootLayout() {
  const { pathname } = useLocation()

  return (
    <div className={styles.appContainer}>
      <div className={styles.app}>

        {/* Navigation bar */}
        <nav className={styles.navBarBkg}>
          <div className={styles.navBar}>
            <div className={styles.leftSide}>
              <h1>TRADE WIZARD</h1>
              <NavButton label="ANALYZE" destination="/analyze" selected={pathname === '/analyze'} />
              <NavButton label="CARDS" destination="/cards" selected={pathname === '/cards'} />
              <NavButton label="ROSTER BUILDER" destination="/roster-builder" selected={pathname === '/roster-builder'} />
            </div>
            <div className={styles.rightSide}>
              User
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main>
          <Outlet />
        </main>

      </div>
    </div>
  )
}
