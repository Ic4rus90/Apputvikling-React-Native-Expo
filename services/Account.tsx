import {Alert, Linking} from 'react-native';
import { signInWithEmailAndPassword, signOut, deleteUser, reauthenticateWithCredential, updatePassword, EmailAuthProvider} from "firebase/auth";
import {auth, db} from "../firebaseConfig";
import { isValidEmail } from '../utils/DataValidation';
import {collection, getDocs, query, where, deleteDoc, updateDoc} from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {navigationRef} from "../modules/RootNavigation";
import {Task} from "../types/Task";
import {Invite} from "../types/Invite";

function loginUser (email, password, whenLoginSuccess) {
    return new Promise((resolve, reject) => {
    if (!isValidEmail(email)) {
        Alert.alert('Invalid email format', 'Please enter a valid email address');
        return;
    }
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        // If user hasverified their email, login

        whenLoginSuccess();
        /*
        if (auth.currentUser.emailVerified === true)
        {
            whenLoginSuccess();
        }
        */

        // If not, throw an error which will be catched later.
        /*
        else
        {
            throw new Error('email-not-verified');
        }
        */

        resolve("Successful login");

    
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const genericMessage = "Wrong email or password";

        if (errorCode === 'auth/wrong-password') {
            Alert.alert('Error', genericMessage);
        }

        else if (errorCode === 'auth/user-not-found') {
            Alert.alert('Error', genericMessage);
        }

        else if (errorMessage === 'email-not-verified'){
            Alert.alert('Error', 'Email has not been verified. Please check your inbox for instructions.');
        }

        //TODO: Add support for auth/too-many-requests
        else
        {
            Alert.alert('Error', errorMessage);
        }

        reject(error.errorMessage);

    });
    });
}


function logoutUser (whenLogoutSuccess) {

    signOut(auth).then(() => {
        whenLogoutSuccess();
        
    }).catch((error) => {
        Alert.alert(error.message)
    });
}


async function deleteTheUser(whenDeleted){
    try {

        const userID = auth.currentUser.uid;
        // Query everything that needs to be deleted
        const tasksQuery = query(
            collection(db, "tasks"),
            where("userID", "array-contains", userID)
        );
        const querySnapshot = await getDocs(tasksQuery);

        // Now loop over all the docs and delete them
        for (const doc of querySnapshot.docs) {
            const documentData = doc.data();
            const userIDArray = documentData.userID;

            if (userIDArray.length > 1)
            {
                const updatedUserIDArray = userIDArray.filter((id) => id !== userID);

                await updateDoc(doc.ref, {
                    userID: updatedUserIDArray
                }).catch((error) => console.warn(error.message));
            }
            else {
                await deleteDoc(doc.ref).catch((e) => console.warn(e));
            }
        }

        // Now delete the user itself
        await deleteUser(auth.currentUser);

        whenDeleted();
    }catch (error){
        Alert.alert(error.message)
    }
}

async function requestPersonalData(whenDataRequested){
    // There was no built-in way to request the user's data, this needs to be written manually
    const data : Record<string, object[]> = {};

    // First get the user information
    // We only want email, created at, last login at
    data["User"] = [{
        email: auth.currentUser.email,
        emailVerified: auth.currentUser.emailVerified,
        createdAt: auth.currentUser.metadata.creationTime,
        lastLoginAt: auth.currentUser.metadata.lastSignInTime
    }];

    // Then get all the tasks
    data["Tasks"] = [];
    const tasksQuery = query(
        collection(db, "tasks"),
        where("userID", "array-contains", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(tasksQuery);
    for (const doc of querySnapshot.docs) {
        const task : Task = doc.data() as Task;
        const taskData = {
            deadline: (task?.deadline) ? task?.deadline?.toDate().toLocaleString() : null,
            completed: task.completed,
            title: task.title,
            note: task.note,
            created: task.created.toDate().toLocaleString(),
            shared: task.shared
        };
        data["Tasks"].push(taskData);
    }

    // Then get all the invites
    data["Invites"] = [];
    const tasksQuery2 = query(
        collection(db, "invites"),
        where("inviter", "==", auth.currentUser.email)
    );
    const querySnapshot2 = await getDocs(tasksQuery2);
    for (const doc of querySnapshot2.docs) {
        const invite : Invite = doc.data() as Invite;
        const taskData = {
            inviter: invite.inviter,
            newUser: invite.newUser
        };
        data["Invites"].push(taskData);
    }

    whenDataRequested(data);
}


async function reauthenticateUser(user, email, password) {
    try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        return true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            Alert.alert('Error', 'Wrong password');
        }
        else {
            Alert.alert(errorMessage);
        }

        return false;
    }
}

async function setNewPassword(user, newPassword) {
    try {
        await updatePassword(user, newPassword);
        return true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/weak-password') {
            Alert.alert('Error', 'Password is too weak. Please provide a password with at least 6 characters');
        } else {
            Alert.alert(errorMessage);
        }
        return false;
    }
}

async function changePassword(oldPassword, newPassword, confirmPassword) {

    try {
        const user = auth.currentUser;
        const email = user.email;
        const authenticationSuccess = await reauthenticateUser(user, email, oldPassword);

        if (!authenticationSuccess) {
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const passwordSet = await setNewPassword(user, newPassword);

        if (!passwordSet) {
            return;
        }

        Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
        const errorMessage = error.message;
        Alert.alert(errorMessage);
    }
}

export {loginUser, logoutUser, deleteTheUser, changePassword, requestPersonalData};