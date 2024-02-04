import React, {useState,useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {auth} from "../firebaseConfig";
import Footer from "../components/Footer";
import GetFolders from "../services/GetFolders"
import {FlashList} from "@shopify/flash-list";
import Header from "../components/Header";
import {CreateInviteModal} from "../components/CreateInvite";
import {Colors} from "../themes/Colors";
import {Button, Dialog, Portal, Provider} from 'react-native-paper';
import FolderPresentation from "../components/FolderPresentation";



const HomeScreen = ({ navigation }) => {

    const [folders, setFolders] = useState([]);
    const [inviteTask, setInviteTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmDeleteFolder, setConfirmDeleteFolder] = useState(false);
    const [folderIsShared, setFolderIsShared] = useState(false);
    const [folderSubTasks, setFolderSubTasks] = useState(0);
    const [deleteFolder, setDeleteFolder] = useState<(() => Promise<void>) | null>(null);



    const user = auth.currentUser;
    const userID = user?.uid;


    const handleDeleteFolder = useCallback((handleDeletion, closeEllipsis, shared?: boolean, subtasks?: number,) => 
    {
        setFolderIsShared(shared);
        setFolderSubTasks(subtasks);
        closeEllipsis();
        setDeleteFolder(() => handleDeletion);
        setConfirmDeleteFolder(true);
    }, []);
    

    GetFolders(userID, setFolders, null);


    return (
        <Provider>
        <View style={styles.container}>
            <Header title={"Home"} navigation={navigation} />
            <View style={styles.folderContainer}>

                <CreateInviteModal
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    taskId={inviteTask}/>

                <FlashList
                    data={folders}
                    renderItem={({item}) =>
                        <View key={item.id} style={styles.folderWrapper}>
                            <FolderPresentation
                                key={item.id}
                                folder={item}
                                navigation={navigation}
                                setInviteTask={setInviteTask}
                                setModalVisible={setModalVisible}
                                onFolderDeleted={handleDeleteFolder}/>
                        </View>
                    }
                    estimatedItemSize={62}
                />
            </View>
            <Footer parent={null}/>
        </View>
        <Portal>
            <Dialog style={styles.dialog} visible={confirmDeleteFolder}>
                <Dialog.Title style={styles.dialogTitle}>Confirm deletion of folder</Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to delete this folder?</Text>
                    <Text>It is currently {folderIsShared ? "shared" : "not shared"} with others, and contains {folderSubTasks ? folderSubTasks : 'no'} subtasks.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setConfirmDeleteFolder(false)}><Text style={{color: Colors.primary}}>Cancel</Text></Button>
                    <Button onPress={() => {setConfirmDeleteFolder(false);deleteFolder();}}><Text style={{color: Colors.red}}>Delete</Text></Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
        </Provider>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
        margin: 10,
        height: 40,
    },
    shareButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
        color: Colors.bg,
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 50
    },
    container: {
        height: "100%",
        backgroundColor: Colors.bg,
    },
    folderWrapper: {
        display: "flex",
        alignItems: "flex-start"
    },
    folderContainer: {
        //display: "flex",
        //margin: 10
        height : "78%"
    },
    dialog: {
        backgroundColor: Colors.bg
    },
    dialogTitle: {
        color: Colors.fg
    },
    folderText: {
        color: Colors.fg,
        textAlign: "left"
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    horizontal: {
        flexDirection: "row",
        padding: 10,
    },
});

export default HomeScreen;