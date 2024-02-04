import {collection, onSnapshot, query, where, and, or, orderBy} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {Alert} from "react-native";
import React, {useEffect} from "react";


const GetFolders = async (userID, setFolders, parentID) => {
    try {

        // The query to be used by the onSnapshot listener to fetch folders.
        const folderQuery = query(
            collection(db, "tasks"),
            where("parentID", "==", null),
            where("userID", "array-contains", userID),
            orderBy("created", "asc")
        );

        useEffect(() => 
        { 
            const unsub = onSnapshot(folderQuery, (querySnapshot) => {
                console.log("Fetched folders");
                const folderArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFolders(folderArray);

            });

            // Return the unsubscribe function to be called when the component unmounts.
            return () => 
            {
                unsub();
            }
        }, [parentID]);
    }
    catch (error) {
        Alert.alert("Error", "Error getting folders");
    }
};

export default GetFolders;