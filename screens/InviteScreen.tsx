import {StyleSheet, View, Text, Pressable, Alert} from "react-native";
import {auth, db} from "../firebaseConfig";
import {
    doc,
    arrayUnion,
    getDoc,
    arrayRemove,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    writeBatch
} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import Header from "../components/Header";
import Footer, {FooterWithoutAdd} from "../components/Footer";
import GetInvites from "../services/GetInvites";
import { Card, Button } from "react-native-paper"
import {Colors} from "../themes/Colors";
import {MaterialIcons} from "@expo/vector-icons";

const InviteScreen = ({navigation}) => {
    const [invites, setInvites] = useState([]);
    const [refreshList, setRefreshList] = useState([]);
    const user = auth.currentUser;
    const userID = user?.uid;
    const userEmail = user?.email;
    const parentID = null;
    const title = "Invitations";

    const DeleteInvitation =  async (refreshList,setRefreshList,userEmail, inviteID) => {
        try {
            const inviteRef = doc(db, "invites", inviteID);
            await deleteDoc(inviteRef);
            setRefreshList(!refreshList)
        } catch (e) {
            console.log(e);
        }
    };

    const AcceptInvite =  async (refreshList,setRefreshList,userEmail,userId, taskID, inviteID ) => {

        try {

            const batchJob = writeBatch(db);

            // Get the folder
            const taskRef = doc(db, "tasks", taskID);
            const task = await getDoc(taskRef);

            //Check if the user is already a collaborator
            if (task.data().userID.includes(userId)) {
                Alert.alert("You are are already a member of this folder")
                await DeleteInvitation(refreshList,setRefreshList,userEmail,inviteID);
                return;
            }

            // Update the task to be shared and add the user to the list of users.
            batchJob.update(taskRef, {
                userID: arrayUnion(userId),
                shared: true
            });

                // Query tasks with rootFolder as ID and userEmail in the invited array
                const subtasksRef = collection(db, 'tasks');
                const q = query(subtasksRef,
                    where("invited", "array-contains", userEmail));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    // Check if the path includes the taskID
                    // By checking the path we make sure that we only update the subtasks in the folder
                    if (doc.data().path.includes(taskID)) {
                    batchJob.update(doc.ref, {
                        userID: arrayUnion(userId),
                        shared: true
                    });
                }
                });

                //Commit the batchjob
                await batchJob.commit();

                //Delete the invite
                await DeleteInvitation(refreshList,setRefreshList,userEmail,inviteID);
        } catch (e) {
            console.log(e.message);
        }
    };
    GetInvites(userEmail, setInvites);


    return (
        <View style={styles.container}>
            <Header title={title} navigation={navigation} />
            <View style={styles.taskWrapper}>
                <FlashList
                    data={invites}
                    renderItem={({item}) =>
                        <Card style={styles.card} mode={"contained"}>
                            <Card.Title
                                titleStyle={{color: Colors.fg}}
                                subtitleStyle={{color: Colors.fg}}
                                title="New invitation!"
                                subtitle={item.inviter + " has invited you to collaborate" }
                            >
                            </Card.Title>
                            <Card.Actions style={styles.spaceBetweenButtons}>
                                <Pressable onPress={() =>
                                    AcceptInvite(refreshList,setRefreshList, userEmail,userID, item.taskID, item.id)}
                                           style={{...styles.button, backgroundColor: Colors.primary}}
                                           hitSlop={20}
                                >
                                    <MaterialIcons name={"check"} size={24} color={Colors.bg} />
                                    <Text style={{color: Colors.bg}}> Accept </Text>
                                </Pressable>
                                <Pressable onPress={() =>
                                    DeleteInvitation(refreshList,setRefreshList,userEmail,item.id)}
                                           style={{...styles.button, backgroundColor: Colors.red}}
                                    hitSlop={20}
                                >
                                    <MaterialIcons name={"clear"} size={24} color={Colors.bg} />
                                    <Text style={{color: Colors.bg}}> Decline </Text>
                                </Pressable>
                            </Card.Actions>
                        </Card>
                    }
                    estimatedItemSize={62}
                />
            </View>
            <FooterWithoutAdd/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    card: {
        backgroundColor: Colors.bg,
        borderWidth: 2,
        borderColor: Colors.secondary,
        margin: 10
    },
    TextField: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    parentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    taskWrapper: {
        height: "80%"
    },
    scroll: {
        height: "10%"
    },
    acceptAndDecline: {
        padding: 10,
        alignItems: "center",
        justifyContent: "space-evenly",
        fontSize: 20,
        color: Colors.primary,
        flexDirection: "row",
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
    },
    spaceBetweenButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        margin: 5,
        backgroundColor: Colors.fg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: Colors.bg,
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    }
});
export default InviteScreen;