import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

export function useUserInfo() {
  const [userInfoObj, setUserInfoObj] = useState({ firstName: '', lastName: '', id: '', logoutUser: () => {} })
  const navigate = useNavigate()

  useEffect(() => {
    // Grab logged in user data
    const userDataRaw = localStorage.getItem('user_data');
    const userData = JSON.parse(userDataRaw ?? '{ id: -1 }');

    if (!userData || userData.id === -1) {
      // Not logged in - kick back to login screen
      navigate('/')
    }

    setUserInfoObj({
      ...userData,
      logoutUser: () => {
        localStorage.removeItem('user_data')
        navigate('/')
      }
    })
  }, [navigate])


  // Return user login info, plus some util functions
  return userInfoObj
}

