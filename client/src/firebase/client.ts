import firebase from "firebase";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN 
}

!firebase.apps.length  && firebase.initializeApp(firebaseConfig)

export const loginWithFacebook = async () => {
    const facebookProvider = new firebase.auth.FacebookAuthProvider()
    const user = await firebase.auth().signInWithPopup(facebookProvider)
    
    const { name, email }:any = user.additionalUserInfo?.profile;
    const { accessToken }:any = user.credential;
    
    return {
        email: email,
        accessToken : accessToken,
        username : name
    }   
}

export const loginWithGoogle = async() => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    const user = await firebase.auth().signInWithPopup(googleProvider)

    const {name, email}:any = user.additionalUserInfo?.profile    
    const {accessToken}:any = user.credential

    return {
        email: email,
        accessToken : accessToken,
        username : name
    }   
}
