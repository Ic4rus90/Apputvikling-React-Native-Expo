import {onSnapshot,query,where,collection,orderBy} from "firebase/firestore";
import {db} from "../firebaseConfig";
import React, {useEffect} from "react";
import {Alert} from "react-native";

const GetInvites = (email, setInvites) => {
    try {
    const inviteQuery = query(
        collection(db, "invites"),
        where("newUser", "==", email)
        );
    useEffect(() => {
    const unsubscribe = onSnapshot(inviteQuery, (querySnapshot) => {
        const inviteArray = querySnapshot.docs.map((doc) => (
            {
                id: doc.id,
                ...doc.data(),
            }));
            setInvites(inviteArray);
        });
        return () =>  
        {
            unsubscribe();
        }
    }, []);}

    catch (error)
    {
    Alert.alert("Error", "Error retrieving invites");
    }
}

export default GetInvites;