import App from 'next/app';
import { FirebaseContext,firebase } from '../firebase';
import useAuthentication from '../hooks/useAuthentication';
useAuthentication
const MyApp=(props)=>{
    const user=useAuthentication();
    const {Component,pageProps}=props;
    return(
        <FirebaseContext.Provider value={{firebase,user}}>
            <Component {...pageProps}/>
        </FirebaseContext.Provider>
    )

}

export default MyApp;