import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebaseConfig";

const CreateFolder = async (userID, title) => {
    try {
        const taskInfo = {
            parentID: null,
            userID: userID,
            title: title
        }
        const docRef = await addDoc(collection(db, "tasks"), taskInfo);
        console.log("Document written with ID: ", docRef.id);
    }
    catch (error) {
        console.log(error);
    }
}

export default CreateFolder;