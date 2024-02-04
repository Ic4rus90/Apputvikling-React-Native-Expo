import React from "react";
import { Appbar, Text } from "react-native-paper";
import {auth} from "../firebaseConfig";
import {StyleSheet, TextComponent, View} from "react-native";
import {Colors} from "../themes/Colors";
import {useNavigationState} from "@react-navigation/native";
import {Task} from "../types/Task";
import {MaterialIcons} from "@expo/vector-icons";

interface HeaderProps {
    title: string;
    navigation: any;
    isShared?: boolean;
}

const Header = ({title, navigation, isShared} : HeaderProps) => {

    const goBack = () => {
        navigation.goBack();
    }

    const openUserMenu = () => {
        navigation.navigate("UserMenu");
    }

    const canGoBack = () => {
        const index = useNavigationState(state => state.index);
        return index !== 0;
    }

    const isSignedIn = () => {
        if (auth.currentUser) {
            return true;
        } else {
            return false;
        }
    }

    const isInside = () => {
        if (title === "Log in" || title === "Register" || title === "Welcome" || title === "Privacy Policy" || title === "Reset password") {
            return false;
        }
        return true;
    }


    return (
        <Appbar.Header style={styles.container}>
            {canGoBack() ? (
            <Appbar.Action style={{flex: 1}} color={styles.text.color} icon="arrow-left" onPress={goBack}/>
            ) : <View style={{flex: 1}}></View>}
            {title === undefined ? (
                <Appbar.Content style={{flex: 10}} color={styles.text.color} title="Forgotten title"/>
            ) : (
                <Appbar.Content style={{flex: 10}} color={styles.text.color} title={
                    <View style={styles.centerTextWrapper}>
                        <Text style={styles.centerText}> {title} </Text>
                        {isShared ? <MaterialIcons color={Colors.bg} style={{bottom: -6, right: -10, ...styles.sharedIcon}} size={14} name="people"/> : null}
                    </View>
                }/>
            )}
            {isSignedIn() && isInside() ? (
                <Appbar.Action style={{flex: 1}} color={styles.text.color} icon="account-circle" onPress={() => openUserMenu()}/>
            ) : <View style={{flex: 1}}></View>}
        </Appbar.Header>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bg
    },
    text: {
        color: 'black'
    },
    centerTextWrapper: {
        position: "relative",
        alignSelf: "center"
    },
    centerText: {
        textAlign: "center",
        fontSize: 24,
        color: 'black'
    },
    sharedIcon: {
        padding: 4,
        borderRadius: 50,
        backgroundColor: Colors.accent,
        position: "absolute"
    }
});

export default Header