import {onSnapshot,query,where,collection,orderBy} from "firebase/firestore";
import {db} from "../firebaseConfig";
import React, {useEffect} from "react";
import {Alert} from "react-native";

// This implementation will fetch tasks from our database and populate the task array/list. 

    const GetTasks = (userID, parentID, setTasks) =>
    {
        try {
        // This defines the query to be used by the onSnapshot listener.
        const tasksQuery = query(
            collection(db, "tasks"),
            where("userID", "array-contains", userID),
            where("parentID", "==", parentID),
            orderBy("completed", "asc"),
            orderBy("created", "asc")
        );
        useEffect(() => {
            const unsub = onSnapshot(tasksQuery, (querySnapshot) => {
                const taskArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTasks(taskArray);
            });
            return () => 
            {
                unsub();
            }
        }, [parentID]);
    }
    catch (error)
    {
        Alert.alert("Error", "Error getting tasks");
    }
    }



export default GetTasks;
