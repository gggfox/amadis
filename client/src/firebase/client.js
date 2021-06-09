import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBiX8urCc3VTtNkZLHLUJrFiny0hAx7nrk",
    authDomain: "amadis-ab770.firebaseapp.com" 
    }

!firebase.apps.length  && firebase.initializeApp(firebaseConfig)

export const loginWithFacebook = () => {
    const facebookProvider = new firebase.auth.FacebookAuthProvider()
    return firebase.auth().signInWithPopup(facebookProvider)
    .then(user => {
        const{additionalUserInfo} = user
        const {profile} = additionalUserInfo
        const {name, email} = profile
       const{credential} = user
        const {accessToken} = credential
        return {
            email: email,
            accessToken : accessToken,
            username : name
        }   
    })
}

export const loginWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(googleProvider)

    .then(user => {
        const{additionalUserInfo} = user
        const {profile} = additionalUserInfo
        const {name, email} = profile
       const{credential} = user
        const {accessToken} = credential

        return {
            email: email,
            accessToken : accessToken,
            username : name
        }   
    })
}
