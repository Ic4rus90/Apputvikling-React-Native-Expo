import React, {useCallback, useState} from "react";
import {auth} from "../firebaseConfig";

import {StyleSheet, View} from "react-native";
import Header from "../components/Header";
import {FlashList} from "@shopify/flash-list";
import {FooterWithoutAdd} from "../components/Footer";
import GetTasksToday from "../services/GetTasksToday";
import TaskPresentation from "../components/TaskPresentation";
import {DismissableNotification} from "../components/Notifications";

const TodaysTasksScreen = ({ navigation }) => {

    const [dailyTasks, setDailyTasks] = useState([]);
    const [dailyTaskChanged, setDailyTaskChanged] = useState(false);
    const [dailyTaskDeleted, setDailyTaskDeleted] = useState(false);
    const [inviteTask, setInviteTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleChangedTask = useCallback(() => {
        setDailyTaskChanged((prev) => !prev);
    }, []);


    const handleDeletedTask = useCallback((state?: boolean) => {
        if (state) {
            setDailyTaskDeleted(state);
            setTimeout(() => {
                setDailyTaskDeleted(false);
            }, 3000);
        }
    }, []);


    const user = auth.currentUser;
    const userID = user?.uid;

    // Fetch tasks from Firestore
    GetTasksToday(userID, setDailyTasks);

    return (
        <View style={styles.container}>
            <Header title={"Today's tasks"} navigation={navigation}/>
            <View style={styles.taskWrapper}>

                <FlashList
                    data={dailyTasks}
                    renderItem={({item}) =>
                        <TaskPresentation
                            key={item.id}
                            task={item}
                            navigation={navigation}
                            onChangedTask={handleChangedTask}
                            onTaskDeleted={handleDeletedTask}
                        />
                    }
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={62}
                />
            </View>
            <DismissableNotification message={"Task has been deleted"}
                                     visibility={dailyTaskDeleted}></DismissableNotification>
            <FooterWithoutAdd/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%"
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

export default TodaysTasksScreen;