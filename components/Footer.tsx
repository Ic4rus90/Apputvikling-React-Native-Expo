import {Platform, Keyboard, Pressable, StyleSheet, Text, View} from "react-native";
import React, {useState, useEffect} from "react";
import * as NavigationBar from 'expo-navigation-bar';
import {useNavigation} from "@react-navigation/native";
import {CreateTaskModal} from "./CreateTask";
import {Colors} from "../themes/Colors";
import {MaterialIcons} from "@expo/vector-icons";



const Footer = ({parent}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
    const navigation = useNavigation<any>();

    let addTaskText;
    let addTaskIcon;
    if (parent === null){
        addTaskText = "Add Folder"
        addTaskIcon = "add";
    }else{
        addTaskText = "Add Task"
        addTaskIcon = "add-task";
    }



    useEffect(() => {
        const keyboardUpListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {setKeyboardIsVisible(true)}
        )


        const keyboardDownListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {setKeyboardIsVisible(false);}
        )

        return () => 
        {
            // Unsubscribe from these listeners. 
            keyboardDownListener.remove();
            keyboardUpListener.remove();
        }

    }, []);

    // If the keyboard is activated, return only the CreateTaskModal and hide the rest of the footer.
    // This is so that the footer will not be pushed up by the keyboard and be in the way. 
    if (keyboardIsVisible)
    {
        return (
            <View style={styles.footerContainerHidden}>
                <CreateTaskModal modalVisible={modalVisible} setModalVisible={setModalVisible} parent={parent}/>
            </View>
            )
    }
 

    return (
        <View style={styles.footerContainer}>
            <CreateTaskModal modalVisible={modalVisible} setModalVisible={setModalVisible} parent={parent}/>
            <Pressable style={styles.buttonWrapper} onPress={() => navigation.navigate('Home')}>
                <MaterialIcons name="home" color={Colors.bg} size={40}/>
                <Text style={styles.button}>Home</Text>
            </Pressable>
            <Pressable style={styles.buttonWrapper} onPress={() => setModalVisible(true)}>
                <MaterialIcons name={addTaskIcon} color={Colors.bg} size={40}/>
                <Text style={styles.button}>{addTaskText}</Text>
            </Pressable>
            <Pressable style={styles.buttonWrapper} onPress={() => navigation.navigate('TodaysTasks')}>
                <MaterialIcons name="today" color={Colors.bg} size={40}/>
                <Text style={styles.button}>Today</Text>
            </Pressable>
        </View>
    );
}

export function FooterWithoutAdd() {
    const navigation = useNavigation<any>();
    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

    useEffect(() => {
        const keyboardUpListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {setKeyboardIsVisible(true)}
        )


        const keyboardDownListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {setKeyboardIsVisible(false);}
        )

        return () => 
        {
            // Unsubscribe from these listeners. 
            keyboardDownListener.remove();
            keyboardUpListener.remove();
        }

    }, []);

    if (keyboardIsVisible)
    {
        return null;
    }

    return (
        <View style={styles.footerContainer}>
            <Pressable style={styles.buttonWrapper} onPress={() => navigation.navigate('Home')}>
                <MaterialIcons name="home" color={Colors.bg} size={40}/>
                <Text style={styles.button}>Home</Text>
            </Pressable>
            <Pressable style={styles.buttonWrapper}>

            </Pressable>
            <Pressable style={styles.buttonWrapper} onPress={() => navigation.navigate('TodaysTasks')}>
                <MaterialIcons name="today" color={Colors.bg} size={40}/>
                <Text style={styles.button}>Today</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        bottom: 0,
        position: "absolute",
        width: "100%",
        alignItems: 'center',
        justifyContent: "space-around",
        display: "flex",
        flexDirection: "row",
        backgroundColor: Colors.primary,
        height: "10%"
    },
    footerContainerHidden: {
        bottom: 0,
        position: "absolute",
        width: "100%",
        alignItems: 'center',
        justifyContent: "space-around",
        display: "flex",
        flexDirection: "row",
        backgroundColor: Colors.primary,
        height: "0%"
    },
    buttonWrapper: {
        width: "33%",
        padding: 15,
        alignItems: "center"
    },
    button: {
        color: Colors.bg,
        fontSize: 16
    }
});

export default Footer