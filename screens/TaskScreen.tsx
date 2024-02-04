import React, {useState, useCallback} from "react";
import {auth} from "../firebaseConfig";
import {StyleSheet, View} from "react-native";
import Footer from "../components/Footer";
import GetTasks from "../services/GetTasks";
import TaskPresentation from "../components/TaskPresentation";
import {FlashList} from "@shopify/flash-list";
import Header from "../components/Header";
import ParentTaskPresentation from "../components/ParentTaskPresentation";
import {DismissableNotification} from "../components/Notifications";
import {Task} from "../types/Task";

const TaskScreen = ({navigation, route}) => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskChanged, setTaskChanged] = useState(false);
    const [taskDeleted, setTaskDeleted] = useState(false);

    const handleChangedTask = useCallback(() => {
        setTaskChanged((prev) => !prev);
    }, []);

    const handleDeletedTask = useCallback((state?: boolean) => {
        if (state) {
            setTaskDeleted(state);
            setTimeout(() => {
                setTaskDeleted(false);
            }, 3000);
        }
    }, []);
    
    const user = auth.currentUser;
    const userID = user?.uid;

    const {parent} = route.params;
    let parentID;
    let title;
    let note;
    let deadline;
    let isShared = false;

    if (parent) {
        parentID = parent.id;
        title = parent.title;
        note = parent.note;
        deadline = parent.deadline;
        isShared = parent.userID.length > 1;
    }

    const [modalVisible, setModalVisible] = useState(false);

    // Fetch tasks from Firestore
    GetTasks(userID, parentID, setTasks);


    return (
        <View style={styles.container}>
            <Header title={title} navigation={navigation} isShared={isShared}/>
            <View style={styles.taskWrapper}>

                <FlashList
                    data={tasks}
                    renderItem={({item}) =>
                        <TaskPresentation
                            key={item.id}
                            task={item}
                            navigation={navigation}
                            onChangedTask={handleChangedTask}
                            onTaskDeleted={handleDeletedTask}/>
                    }
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={62}
                    ListHeaderComponent={
                        <ParentTaskPresentation notes={note} deadline={deadline}/>
                    }
                />
                <DismissableNotification message={"Task has been deleted"}
                                         visibility={taskDeleted}></DismissableNotification>
            </View>
            <Footer parent={parent}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    parentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    taskWrapper: {
        height: "77%"
    },
    scroll: {
        height: "10%"
    },
    button: {
        padding: 10,
        color: "black",
        fontSize: 20,
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderColor: "black",
    },
});

export default TaskScreen;