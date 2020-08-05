import { useState, useEffect } from 'react';
import { firebase } from '../firebase';

function useAuthentication() {
    const [userAuthenticate, setUserAuhenticate] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                setUserAuhenticate(user);
            } else {
                setUserAuhenticate(null);
            }
        })

        return () => unsubscribe()
    }, [])

    return userAuthenticate;
}

export default useAuthentication;