import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput} from 'react-native';
import {
    arrayUnion,
    collection,
    doc,
    getDocs,
    query,
    where,
    writeBatch
} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import {Colors} from "../themes/Colors";
import {isValidEmail} from '../utils/DataValidation';
import {Invite} from "../types/Invite";


export const CreateInviteModal = ({modalVisible, setModalVisible, taskId}) => {
    const [inviteEmail, setInviteEmail] = useState("");

    const user = auth.currentUser;
    const userEmail = user?.email;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                console.log('Modal has been closed.');
                setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(false)}
                        hitSlop={5}>
                        <Text style={styles.buttonCloseFont}>X</Text>
                    </Pressable>
                    <TextInput
                        placeholder={"Email to invite"}
                        onChangeText={setInviteEmail}
                        inputMode={'email'}
                        style={styles.textInput}>
                    </TextInput>
                    <Pressable
                        style={styles.button}
                        onPress={() => [CreateInvite(userEmail.toLowerCase(),inviteEmail.toLowerCase(),taskId),setInviteEmail(""),setModalVisible(false)]}>
                        <Text style={styles.textStyle}>Send Invite</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const CreateInvite =  async (userEmail, inviteEmail, taskId) => {
    try {
    const userID = auth.currentUser.uid;

    if (isValidEmail(inviteEmail)) {
        const inviteInfo : Invite = {
            inviter: userEmail,
            newUser: inviteEmail,
            taskID: taskId,
        }

        //Check if the user is already invited to the folder
        const alreadyInvitedRef = collection(db, "invites");
        const query1 = query(alreadyInvitedRef,
            where("inviter", "==", userEmail),
            where("newUser", "==", inviteEmail),
            where("taskID", "==", taskId)
        );
        const querySnapshot1 = await getDocs(query1);

        if (!querySnapshot1.empty) {
            Alert.alert("You have already invited this user");
            return;
        }

        //Check for shenanigans
        if (inviteEmail === userEmail) {
            Alert.alert("You cannot invite yourself");
            return;
        }

        const batchJob = writeBatch(db);

        //If we get here, then the user is not already invited
        const inviteRef = doc(collection(db, "invites"));
        batchJob.set(inviteRef, inviteInfo);

        const docRef = doc(db, "tasks", taskId);
        batchJob.update(docRef, {
            invited: arrayUnion(inviteEmail)
        });

        const subtasksRef = collection(db, "tasks");
        const q = query(subtasksRef,
            where("userID", "array-contains", userID)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (doc.data().path.includes(taskId)) {
                batchJob.update(doc.ref, {
                    invited: arrayUnion(inviteEmail)
                });
            }
        });

        await batchJob.commit();

    } else {
        Alert.alert("Invalid email address");
    }
    } catch (e) {
        Alert.alert(e.message);
        console.log(e.message)
    }
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: Colors.fg,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 10,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        right: 10,
    },
    buttonCloseFont: {
        color: 'black',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textInput: {
        fontSize: 20,
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        textAlign: 'center'
    }
});