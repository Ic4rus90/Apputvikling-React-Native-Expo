import {doc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";
import React, {useEffect, useState} from "react";
import {Modal, StyleSheet, Text, Pressable, View, TextInput, Alert, Platform} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Switch} from "react-native-paper";
import {Colors} from "../themes/Colors"

const EditTask = async (taskID, title, note, deadline) => {
    try {
        const docRef = doc(db, "tasks", taskID);
        await updateDoc(docRef, {
            title: title,
            note: note,
            deadline: deadline
        });
    } catch (error) {
        console.log(error);
    }
}

export const EditTaskModal = ({editModalVisible, setEditModalVisible, task}) => {
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskNote, setTaskNote] = useState(task.note);
    const [deadline, setDeadline] = useState(null);
    const [isDatePickerVisible, setShowDatePicker] = useState(false);
    const [isTimePickerVisible, setShowTimePicker] = useState(false);
    const [switchOn, setSwitchOn] = useState(false);

    const confirmChanges = "Confirm Changes";

    useEffect(() => {
        setTaskTitle(task.title);
        setTaskNote(task.note);
    }, [task]);

    const handleEditTask = () =>  
    {
        if (taskTitle === "")
        {
            Alert.alert("Empty title", "Title cannot be empty");
            return;
        }

        if (switchOn)
        {
            EditTask(task.id, taskTitle, taskNote, deadline);
        }

        if (!switchOn)
        {
            EditTask(task.id, taskTitle, taskNote, null);
        }
        //setSwitchOn(false);
        setEditModalVisible(!editModalVisible);
    }

    useEffect(() => {
        if (task.deadline !== null) {
            setSwitchOn(true);
            setDeadline(task.deadline.toDate());
        }
        else {
            setSwitchOn(false);
            setDeadline(new Date());
        }
    }, [task]);

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

    const formatTime = (deadline) => {
        const hours = deadline.getHours().toString().padStart(2, '0');
        //Padstart legger til 0 foran hvis det er mindre enn 2 siffer
        const minutes = deadline.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
        //Returnerer tid på formatet xx:xx
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => {
                    setEditModalVisible(!editModalVisible);
                    setTaskTitle(task.title);
                    setTaskNote(task.note);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setEditModalVisible(!editModalVisible);
                                setTaskTitle(task.title);
                                setTaskNote(task.note);}}
                            hitSlop={5}>
                            <Text style={styles.buttonCloseFont}>X</Text>
                        </Pressable>

                        <TextInput
                            value={taskTitle}
                            onChangeText={(text) => {
                                if (Platform.OS === 'ios') {
                                    if (text.length <= 60) {
                                        setTaskTitle(text)
                                    }
                                } else {
                                    setTaskTitle(text)
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
                            value={taskNote}
                            onChangeText={(text) => {
                                if (Platform.OS === 'ios') {
                                    if (text.length <= 150) {
                                        setTaskNote(text)
                                    }
                                } else {
                                    setTaskNote(text)
                                }
                            }}
                            inputMode={'text'}
                            multiline={true}
                            maxLength={Platform.OS === 'android' ? 150 : null}
                            blurOnSubmit={true}
                            style={styles.textInput}>
                        </TextInput>

                        <View style={styles.taskView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.modalText}>Deadline:   </Text>
                                <Switch value={switchOn} onValueChange={toggleDeadlineSwitch}/>
                            </View>
                            {switchOn ? showDeadlinePicker() : <View></View>}
                        </View>

                        <Pressable
                            style={[styles.button]}
                            onPress={handleEditTask}>
                            <Text style={styles.textStyle}>{confirmChanges}</Text>
                        </Pressable>
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

export default EditTaskModal;