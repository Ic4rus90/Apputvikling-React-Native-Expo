import {doc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";
import React, {useEffect, useState} from "react";
import {Modal, StyleSheet, Text, Pressable, View, TextInput, Alert, Platform} from "react-native";
import {Colors} from "../themes/Colors"



const EditFolder = async(folderID, title, note) => {

    try {
        const docRef = doc(db, "tasks", folderID);
        await updateDoc(docRef, {
            title: title,
            note: note
        });
    }
    catch(error)
    {
        Alert.alert("Error", "There was an error renaming the folder");
    }
}

export const EditFolderModal = ({editModalVisible, setEditModalVisible, folder}) => {
    const [folderTitle, setFolderTitle] = useState(folder.title);
    const [folderNote, setFolderNote] = useState(folder.note);

    const confirmChanges = "Confirm changes";

    useEffect(() => {
        setFolderTitle(folder.title);
        setFolderNote(folder.note);
    }, [folder]);

    const handleEditFolder = (folderId, folderTitle) => 
{
    if (folderTitle === "")
    {
        Alert.alert("Empty title", "Title cannot be empty");
        return;
    }

    EditFolder(folderId, folderTitle, folderNote);
    setEditModalVisible(!editModalVisible);

}

    return (
        <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editModalVisible}
                    onRequestClose={() => {
                        setEditModalVisible(!editModalVisible);
                        setFolderTitle(folder.title);
                        setFolderNote(folder.note);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setEditModalVisible(!editModalVisible)
                                    setFolderTitle(folder.title);
                                    setFolderNote(folder.note);
                                }}
                                hitSlop={5}>
                                <Text style={styles.buttonCloseFont}>X</Text>
                            </Pressable>

                            <TextInput
                                value={folderTitle}
                                onChangeText={(text) => {
                                    if (Platform.OS === 'ios') {
                                        if (text.length <= 60) {
                                            setFolderTitle(text)
                                        }
                                    } else {
                                        setFolderTitle(text)
                                    }
                                }}
                                inputMode={'text'}
                                multiline={true}
                                maxLength={Platform.OS === 'android' ? 60 : null}
                                blurOnSubmit={true}
                                style={styles.textInput}>
                            </TextInput>

                            <TextInput
                                placeholder={"Add a note"}
                                value={folderNote}
                                onChangeText={(text) => {
                                    if (Platform.OS === 'ios') {
                                        if (text.length <= 150) {
                                            setFolderNote(text)

                                        }
                                    } else {
                                        setFolderNote(text)
                                    }
                                }}
                                inputMode={'text'}
                                multiline={true}
                                maxLength={Platform.OS === 'android' ? 150 : null}
                                blurOnSubmit={true}
                                style={styles.textInput}>
                            </TextInput>

                            <Pressable
                                style={[styles.button]}
                                onPress={() =>
                                {handleEditFolder(folder.id, folderTitle);}}>
                                <Text style={styles.textStyle}>{confirmChanges}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    taskView: {
        backgroundColor: 'white',
        alignItems: 'center',
    },

    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
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
        fontSize: 20,
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

export default EditFolderModal;