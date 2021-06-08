import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBiX8urCc3VTtNkZLHLUJrFiny0hAx7nrk",
    authDomain: "amadis-ab770.firebaseapp.com" 
    }

!firebase.apps.length  && firebase.initializeApp(firebaseConfig)

export const loginWithFacebook = () => {
    const facebookProvider = new firebase.auth.FacebookAuthProvider()
    return firebase.auth().signInWithPopup(facebookProvider)
   /* .then(user => {
        const{additionalUserInfo} = user
        const {profile} = additionalUserInfo
        const {first_name, last_name, email} = profile

        return {
            email: email,
            username : first_name + " " + last_name
        }   
    })*/
}