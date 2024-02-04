import {addDoc, collection, doc, Timestamp, updateDoc} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import React, {useState} from "react";
import {Modal, StyleSheet, Text, Pressable, View, TextInput, Alert} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Switch} from "react-native-paper";
import {Colors} from "../themes/Colors"
import {countSubtasks} from "../services/CountSubtasks";

const CreateTask = async (parentID, userID, title, note, deadline, path, parentUsers, creator) => {
    try {

        const taskInfo = {
            parentID: parentID,
            userID: userID,
            title: title,
            note: note,
            deadline: deadline,
            path: path,
            completed: false,
            created: Timestamp.now(),
            subtasksCount: 0,
            invited: [],
            creator: creator
        }

        if (parentUsers.length > 1) {
            taskInfo.userID = parentUsers;
        }



        const docref = await addDoc(collection(db, "tasks"), taskInfo);
        console.log("Document written with ID: ", docref.id);

    } catch (error) {
        console.log(error);
    }

    // Update subtasks of parent
    const count = await countSubtasks(parentID);
    try {
        const docRef = doc(db, "tasks", parentID);
        await updateDoc(docRef, {
            subtasksCount: count
        });
    } catch (error) {
        console.log(error);
    }
}

export const CreateTaskModal = ({modalVisible, setModalVisible, parent}) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskNote, setTaskNote] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [isDatePickerVisible, setShowDatePicker] = useState(false);
    const [isTimePickerVisible, setShowTimePicker] = useState(false);
    const [switchOn, setSwitchOn] = useState(false);

    const user = auth.currentUser;
    const userID = [user?.uid];

    // == checks for null or undefined, instead of === which checks for null only
    const parentID = parent == null ? null : parent.id;
    const parentPath = parent?.path ?? [];
    const parentUsers = parent?.userID ?? [];
    const childPath = parentPath.concat(parentID);
    const addTaskName = parentID == null ? "Add Folder" : "Add Task";

    const toggleDeadlineSwitch = () => {
        setSwitchOn(!switchOn);
    }

    const showDatePicker = () => {
        setShowDatePicker(true);
    };

    const hideDatePicker = () => {
        setShowDatePicker(false);
    };

    const showTimePicker = () => {
        setShowTimePicker(true);
    }

    const hideTimePicker = () => {
        setShowTimePicker(false);
    }

    const handleDateConfirm = (selectedDate) => {
        const newDeadline = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            deadline.getHours(),
            deadline.getMinutes()
        );
        hideDatePicker();
        setDeadline(newDeadline);
    };

    const handleTimeConfirm = (selectedTime) => {
        const newDeadline = new Date(
            deadline.getFullYear(),
            deadline.getMonth(),
            deadline.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );
        hideTimePicker();
        setDeadline(newDeadline);
    };

    const showDeadlinePicker = () => {
        return (
            <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => showDatePicker()}>
                <Text style={[styles.textInput]}>
                    {deadline.toLocaleDateString()}📅
                </Text>
            </Pressable>
        </View>

        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            date={deadline}
            mode="date"
            minimumDate={new Date(Date.now())}
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Pressable
                onPress={() => showTimePicker()}>
                <Text style={[styles.textInput]}>
                    {formatTime(deadline)}⏰
                </Text>
            </Pressable>
        </View>

        <DateTimePickerModal
            isVisible={isTimePickerVisible}
            date={deadline}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
        />
        </View>
        )
    }

    const isTask = () => {

        if (parentID != null) {
            return (
                <View style={styles.taskView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.modalText}>Deadline:   </Text>
                    <Switch color={Colors.primary} value={switchOn} onValueChange={toggleDeadlineSwitch}/>
                    </View>
                    {switchOn ? showDeadlinePicker() : null}
            </View>
        )}
    }

    const formatTime = (deadline) => {
        const hours = deadline.getHours().toString().padStart(2, '0');
        //Padstart legger til 0 foran hvis det er mindre enn 2 siffer
        const minutes = deadline.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
        //Returnerer tid på formatet xx:xx
    };


    // This function is used to "clean up" the modal after a task had been created and after it has been closed.
    const resetModalFields = () => 
    {
        setTaskTitle("");
        setTaskNote("");
        setDeadline(new Date());
        setShowDatePicker(false);
        setShowTimePicker(false);
        setSwitchOn(false);
    }

    const handleCreateTask = async () => 
    {

        // Check if task/folder title is empty

        if (taskTitle === "")
        {
            Alert.alert("Empty title", "Title cannot be empty");
            return;
        }

        if (switchOn) 
        {
            CreateTask(parentID, userID, taskTitle, taskNote, deadline, childPath, parentUsers, user.email);
        }

        else if (!switchOn)
        {
            CreateTask(parentID, userID, taskTitle, taskNote, null, childPath, parentUsers, user.email);
        }

        setModalVisible(!modalVisible);
        setSwitchOn(false);
        resetModalFields();
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                            hitSlop={5}>
                            <Text style={styles.buttonCloseFont}>X</Text>
                        </Pressable>

                        <TextInput
                            placeholder={"Title"}
                            onChangeText={setTaskTitle}
                            inputMode={'text'}
                            multiline={true}
                            maxLength={60}
                            blurOnSubmit={true}
                            value={taskTitle}
                            style={styles.textInput}>
                        </TextInput>

                        <TextInput
                            placeholder={"Notes"}
                            onChangeText={setTaskNote}
                            inputMode={'text'}
                            multiline={true}
                            maxLength={150}
                            blurOnSubmit={true}
                            value={taskNote}
                            style={styles.textInput}>
                        </TextInput>

                        {isTask()}

                        {switchOn ?
                            <Pressable
                            style={[styles.button]}
                            onPress={handleCreateTask}>
                            <Text style={styles.textStyle}>{addTaskName}</Text>
                        </Pressable>
                            :
                            <Pressable
                            style={[styles.button]}
                            onPress={handleCreateTask}>
                            <Text style={styles.textStyle}>{addTaskName}</Text>
                        </Pressable>}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
        backgroundColor: Colors.accent,
        borderRadius: 20,
        padding: 10,
    },
    buttonOpen: {
        backgroundColor: Colors.primary,
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
        borderRadius: 10,
        borderColor: Colors.primary,
        borderWidth: 1,

        minWidth: "60%",
        marginBottom: 10
    }
});

export default CreateTask;