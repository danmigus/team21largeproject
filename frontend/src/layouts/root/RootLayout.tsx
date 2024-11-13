import styles from './styles.module.css'
import {Outlet, useLocation} from "react-router-dom";
import NavButton from "../../components/NavButton/NavButton.tsx";
import {useUserInfo} from "../../util/userUtil.ts";
import {Snackbar, SnackbarContext} from "../../util/snackbar.ts";
import {useRef, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function RootLayout() {
  const { firstName, lastName, logoutUser } = useUserInfo()
  const { pathname } = useLocation()

  const [curSnackbar, setCurSnackbar] = useState<Snackbar | null>(null)
  const snackbarTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSetSnackbar = (newVal: Snackbar | null) => {
    clearTimeout(snackbarTimer.current)

    if (!newVal) {
      setCurSnackbar(null)
      return
    }

    setCurSnackbar(newVal)
    snackbarTimer.current = setTimeout(() => setCurSnackbar(null), 3500)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarContext.Provider value={{ cur: curSnackbar, set: handleSetSnackbar }}>
        <div className={styles.appContainer}>
          <div className={styles.app}>

            {/* Navigation bar */}
            <nav className={styles.navBarBkg}>
              <div className={styles.navBar}>
                {/* Title and nav*/}
                <div className={styles.leftSide}>
                  <h1>TRADE WIZARD</h1>
                  <NavButton label="ANALYZE" destination="/analyze" selected={pathname === '/analyze'} />
                  <NavButton label="ROSTER BUILDER" destination="/roster-builder" selected={pathname === '/roster-builder'} />
                </div>

                {/* User controls */}
                <div className={styles.rightSide}>
                  <div className={styles.userInfo}>
                    <span className={styles.username}>{`${firstName} ${lastName}`}</span>
                    <button className={styles.logoutButton} onClick={logoutUser}>Logout</button>
                  </div>
                  <img className={styles.pfp} alt="User profile icon" src="/user.svg" />
                </div>
              </div>
            </nav>

            {/* Main content */}
            <main style={{ height: '100%', paddingBottom: '2rem' }}>
              <Outlet />
            </main>

            {/* Snackbar */}
            {curSnackbar && (
              <div className={styles.snackbar}>
                {curSnackbar.label}
              </div>
            )}

          </div>
        </div>
      </SnackbarContext.Provider>
    </QueryClientProvider>
  )
}
