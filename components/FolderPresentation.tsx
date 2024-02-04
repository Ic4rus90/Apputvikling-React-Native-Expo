import {Pressable, StyleSheet, Text, TouchableOpacity, View, Alert, Platform} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {Colors} from "../themes/Colors";
import React, {useState} from "react";
import {doc, updateDoc, deleteDoc, where, query, collection, getDocs, arrayRemove} from "firebase/firestore";
import {countSubtasks} from "../services/CountSubtasks";
import {Card, Divider, Menu} from "react-native-paper";
import {Task} from "../types/Task";
import {auth, db} from "../firebaseConfig";
import EditFolderModal from "./EditFolder";

interface FolderPresentationProps {
    folder: Task;
    navigation: any;
    setInviteTask: (number) => void;
    setModalVisible: (boolean) => void;
    onFolderDeleted: (handleDeletion, closeEllipsis, shared : boolean, subtasks : number) => void;
}

const FolderPresentation = ({folder, navigation, setInviteTask, setModalVisible, onFolderDeleted} : FolderPresentationProps) => {

    const [visibleEllipsis, setVisibleEllipsis] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const openEllipsis = () => setVisibleEllipsis(true);

    const closeEllipsis = () => setVisibleEllipsis(false);

    const isShared = folder.userID.length > 1;

    const handleDeletion = async () => 
    {

      try {
          const userID = auth.currentUser.uid;
          const folderID = folder.id;
          const taskRef = doc(db, "tasks", folderID);

          // Delete subtasks in folder
          if (folder.subtasksCount > 0) {
              const subtasksRef = collection(db, "tasks");
              const q = query(subtasksRef,
                  where("userID", "array-contains", userID),
              );
              const querySnapshot = await getDocs(q);
              console.log(querySnapshot)
              querySnapshot.forEach((doc) => {
                  if (doc.data().path.includes(folderID) || doc.id === folderID) {
                      if (isShared) {
                            updateDoc(doc.ref, {
                                userID: arrayRemove(userID),
                            });
                      }
                        else {
                          deleteDoc(doc.ref);
                      }
                }
                });
        }
        else
          {
              // Delete folder
              if (isShared)
                  updateDoc(taskRef, {
                          userID: arrayRemove(userID),
                      }
                  );
              else
                {
                  await deleteDoc(taskRef);
                }
          }
      } catch (error) {
          Alert.alert(error.code, error.message);
      }
    }

    
    const handleDeleteRequest = async () => 
    {
        let subtasks = await countSubtasks(folder.id);
        onFolderDeleted(handleDeletion, closeEllipsis, isShared, subtasks,);
    }


    const renderFolderTitle = () => {
        return (
            <Text style={styles.folderText} numberOfLines={1}>{folder.title}</Text>
        )
    }

    const folderIcon = () => {
        let subTaskStyle : any = styles.subtaskCounterIconCenter;
        if (folder?.subtasksCount > 0 && isShared)
            subTaskStyle = styles.subtaskCounterIcon;

        return (
            <View style={{position: "relative"}}>
                <MaterialIcons
                    name="folder"
                    color={Colors.secondary}
                    size={40}
                />
                <View style={subTaskStyle}>
                    {folder?.subtasksCount > 0 ?
                        <Text style={styles.subtaskText}>{folder.subtasksCount}</Text>
                        :
                        null
                    }
                </View>
                {isShared ? <MaterialIcons color={Colors.bg} style={{bottom: -2, right: -2, ...styles.sharedIcon}} size={14} name="people"/> : null}
            </View>
        )
    }

    const folderButton = () => {
        return (
            <TouchableOpacity
                style={styles.folderButton}
                onPress={() =>
                    navigation.navigate("Tasks", {parent: folder})}
            >
                {folderIcon()}
                {renderFolderTitle()}
            </TouchableOpacity>
        )
    }

return (
    <View style={styles.folderContainer} key={folder.id}>
        <Pressable style={styles.folderButton} onPress={() => navigation.navigate("Tasks", {parent: folder})}>
            <Card mode={"contained"} style={{ backgroundColor: Colors.bg }}>
                <Card.Title title={<Text style={{fontSize: 20, color: styles.folderText.color}}>{folder.title}</Text>} left={folderIcon} style={styles.alignCardTitle}/>
                <Card.Content>
                    {folder?.note ? <Text numberOfLines={1}>{folder.note}</Text> : null}
                </Card.Content>
            </Card>
        </Pressable>
        <View style={styles.ellipsisWrapper}>
            <EditFolderModal editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} folder={folder}/>
            <Menu
                visible={visibleEllipsis}
                onDismiss={closeEllipsis}
                anchor={
                    <Pressable style={styles.ellipsis} onPress={() => openEllipsis()}>
                        <MaterialIcons style={styles.moreIcon} name="more-vert" color={Colors.primary} />
                    </Pressable>
                }>
                <Menu.Item
                    onPress={() => {
                        setEditModalVisible(true);
                        closeEllipsis();}}
                    title="Edit folder"/>
                <Divider />
                <Menu.Item onPress={handleDeleteRequest} title="Delete folder" />
                <Divider />
                <Menu.Item onPress={() => {[setInviteTask(folder.id), setModalVisible(true)]; closeEllipsis();}} title="Invite people to folder" />
            </Menu>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
    folderContainer: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.bg,
        borderTopWidth: 2,
        borderColor: Colors.lightGrey,
        overflow: "hidden"
    },
    alignCardTitle: {
        alignItems: "flex-end",
        color: 'black'
    },
    folderButton: {
        flex: 0.88,
        elevation: 0, // remove elevation on Android
        shadowOpacity: 0, // remove shadow on iOS
        borderWidth: 0, // remove border
    },

    ellipsisWrapper: {
        flex: 0.12,
        alignItems: "stretch",
        justifyContent: "center"
    },
    ellipsis: {
        height: "100%",
        flexDirection: "row",
        justifyContent: "center"
    },
    moreIcon: {
        color: Colors.primary,
        fontSize: 25,
        marginTop: 26
    },
    folderText: {
        color: 'black',
        textAlign: "left",
        fontSize: 20
    },
    sharedIcon: {
        padding: 4,
        borderRadius: 50,
        backgroundColor: Colors.accent,
        position: "absolute"
    },
    subtaskText: {
        color: Colors.bg,
        fontSize: 20
    },
    subtaskCounterIcon: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        bottom: 0,
        left: 8
    },
    subtaskCounterIconCenter: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
        top: 3,
        bottom: 0
    }
});

export default FolderPresentation;