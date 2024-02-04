import {onSnapshot,query,where,collection,orderBy} from "firebase/firestore";
import {db} from "../firebaseConfig";
import React, {useEffect} from "react";
import {Alert} from "react-native";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;


import { startOfDay, endOfDay } from "date-fns";

const GetTasksToday = (userID, setDailyTasks) => {
console.log(userID)
    //const [date, setDate] = React.useState(new Date());

    try {
        let today = new Date();
        /*
        if (date < today) {
            setDate(today);
        }
*/
        let start = startOfDay(today);
        let end = endOfDay(today);

        // This defines the query to be used by the onSnapshot listener.
        const dailyTaskQuery = query(
            collection(db, "tasks"),
            where("userID", "array-contains", userID),
            where("deadline", "<", end),
            where("completed", "==", false),
            orderBy("deadline", "asc")
        );

        useEffect(() => {

            const unsub = onSnapshot(dailyTaskQuery, (querySnapshot) => {
                console.log(start);
                console.log(end);
                const dailyTaskArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDailyTasks(dailyTaskArray);
                console.log(dailyTaskArray)
                console.log("daily tasks fetched")
            });
            return () => {
                unsub();
            };
        }, []);
    } catch (error) {
        Alert.alert(error.code, error.message);
    }
};
export default GetTasksToday;
