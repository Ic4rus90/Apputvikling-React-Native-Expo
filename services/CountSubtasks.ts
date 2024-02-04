import {collection, getCountFromServer, query, where} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";

/**
 * Function to count subtasks of parent
 * @param parentID{string} The id of the parent
 * @return number
 */
export async function countSubtasks(parentID : string){
    try {
        const userID = auth.currentUser?.uid;
        const coll = collection(db, "tasks");
        const q = query(coll, where("parentID", "==", parentID), where("userID" , "array-contains", userID));
        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;
        return count;
    } catch (e) {
        console.error(e);
    }
}