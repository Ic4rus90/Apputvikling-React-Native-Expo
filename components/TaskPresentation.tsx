import React from "react";
import {Pressable, TouchableOpacity, Text, View, StyleSheet, Alert} from "react-native";
import CheckBox from "expo-checkbox";
import {doc, updateDoc, deleteDoc, where, query, collection, getDocs, arrayRemove} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import {colorBetween, Colors} from "../themes/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import {Task} from "../types/Task";
import {countSubtasks} from "../services/CountSubtasks";
import {Divider, Menu} from "react-native-paper";
import EditTaskModal from "./EditTask";
import {DateTimeToBeautiful, EpochNow, SecondsBetween} from "../utils/DateTimeFormatter";
import {easeIn} from "../utils/ExtraMath";

interface TaskPresentationProps {
    task: Task;
    navigation: any;
    onChangedTask: () => void;
    onTaskDeleted: (boolean) => void;
}

const TaskPresentation = ({task, navigation, onChangedTask, onTaskDeleted} : TaskPresentationProps) => {

    const [visibleEllipsis, setVisibleEllipsis] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);

    const openEllipsis = () => setVisibleEllipsis(true);

    const closeEllipsis = () => setVisibleEllipsis(false);

    const handleCheck = async () => {

        const taskRef = doc(db, "tasks", task.id);
        if (task.completed) {
            await updateDoc(taskRef, {
                completed: false
            });
        } else {
            await updateDoc(taskRef, {
                completed: true
            });
        }
        onChangedTask();
        return;
    }


  const handleDeletion = async () => {
      try {
          //Delete task
          const userID = auth.currentUser.uid;
          const taskID = task.id;
          const taskRef = doc(db, "tasks", taskID);

          // Delete subtasks in folder
          if (task.subtasksCount > 0) {
              const subtasksRef = collection(db, "tasks");
              const q = query(subtasksRef,
                  where("userID", "array-contains", userID),
              );
              const querySnapshot = await getDocs(q);
              console.log(querySnapshot)
              querySnapshot.forEach((doc) => {
                  if (doc.data().path.includes(taskID) || doc.id === taskID) {
                          deleteDoc(doc.ref);
                  }
              });
              await deleteDoc(taskRef);
          }
          else
          {
              // Delete task
              await deleteDoc(taskRef);
          }
          // Update subtasks of parent
          if (task.parentID) {
              const count = await countSubtasks(task.parentID);
              const docRef = doc(db, "tasks", task.parentID);
              await updateDoc(docRef, {
                  subtasksCount: count
              });
          }
          await onTaskDeleted(true);
      } catch (error) {
          Alert.alert(error.code, error.message);
      }
  }

    const renderTitle = () => {
        if (task.completed) {
            return (
                <Text style={{...styles.text, textDecorationLine: 'line-through' }}>{task.title}</Text>
            )
        } else {
            return (
                <Text style={styles.text}>{task.title}</Text>
            )
        }
    }

    const SubtaskCounter = () => {
        if (task?.subtasksCount <= 0) return null;

        return (
            <View style={styles.subtaskWrapper}>
                <Text style={styles.subtaskText}>{task.subtasksCount}</Text>
            </View>
        )
    }

    const Deadline = () => {
        if (!task.deadline) return null;

        // As the deadline is past 24 hours, start changing the color to red
        const colorStart = Colors.fg;
        const colorEnd = Colors.red;
        const secondsBetween = SecondsBetween(task.deadline.toDate(), EpochNow());
        const percentage = Math.max(Math.min(1 - secondsBetween/60/60/24, 1), 0);
        const color = colorBetween(colorStart, colorEnd, easeIn(percentage, 0.5));

        return (
            <View style={styles.deadlineWrapper}>
                <MaterialIcons style={{color: color, ...styles.deadlineIcon}} name={"access-time"} size={20}/>
                <Text style={{color: color}}>{DateTimeToBeautiful(task.deadline.toDate())}</Text>
            </View>
        );
    }

  return (
      <View style={styles.container} key={task.id}>
          <EditTaskModal editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible} task={task}/>
          {Deadline()}
          <View style={styles.upperWrapper}>
              <CheckBox
                  value={task.completed}
                  onValueChange={handleCheck}
                  color={Colors.accent}
                  style={styles.checkbox}
              />
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.push("Tasks", { parent: task})}
              >
              {renderTitle()}
              </TouchableOpacity>
              <Menu
                  visible={visibleEllipsis}
                  onDismiss={closeEllipsis}
                  anchor={
                      <Pressable onPress={() => openEllipsis()}>
                          <MaterialIcons style={styles.ellipsisButton} name="more-vert" />
                      </Pressable>
                  }>
                  <Menu.Item
                      onPress={() => {
                      setEditModalVisible(true);
                      closeEllipsis();}}
                             title="Edit task" />
                  <Divider />
                  <Menu.Item onPress={() => {handleDeletion()}} title="Delete task" />
              </Menu>
          </View>
          <View style={styles.bottomWrapper}>
              {task?.note ? <Text numberOfLines={1} style={styles.note}>{task.note}</Text> : null}
              <View style={styles.rightIcons}>
                  {SubtaskCounter()}
              </View>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderColor: Colors.primary,
        borderWidth: 2,
        margin: 10,
        padding: 10,
        backgroundColor: Colors.bg
    },
    upperWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    bottomWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    checkbox: {
        width: 20,
        height: 20,
        backgroundColor: Colors.bg,
        borderColor: Colors.bg,
        borderWidth: 1,
    },
    note: {
        color: Colors.grey,
        maxWidth: "80%",
        overflow: "hidden"
    },
    button: {
        flex: 1,
        padding: 10,
        color: "black",
        fontSize: 20,
    },
    text: {
        color: 'black',
        fontSize: 20,
    },
    inviteButton: {
        color: Colors.bg,
        fontSize: 20,
    },
    ellipsisButton: {
        color: Colors.primary,
        fontSize: 25,
    },
    deleteButton: {
        color: Colors.red,
        fontSize: 20,
    },
    subtaskIcon: {
        color: Colors.bg,
        fontSize: 20
    },
    subtaskText: {
        color: Colors.bg,
        fontSize: 20,
        position: "absolute",
    },
    subtaskWrapper: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        borderRadius: 50,
        backgroundColor: Colors.accent,
        width: 24,
        height: 24
    },
    rightIcons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: "auto"
    },
    deadlineWrapper: {
        position: "absolute",
        paddingLeft: 10,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
        top: 0,
        left: 0
    },
    deadlineIcon: {
        marginRight: 4
    }
});

export default TaskPresentation;
