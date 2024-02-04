import {changePassword} from "../services/Account";
import {useState} from "react";
import {View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform} from 'react-native';
import React from "react";
import {FooterWithoutAdd} from "../components/Footer";
import Header from "../components/Header";
import { Colors } from "../themes/Colors";


const ChangePassword = ({navigation}) => {
    const [oldPassword, setOldPassword] = useState("Old password");
    const [newPassword, setNewPassword] = useState("New password");
    const [confirmPassword, setConfirmPassword] = useState("Confirm password");

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <Header title={"Change Password"} navigation={navigation}/>
                <TextInput placeholder={"Old password"} onChangeText={setOldPassword} autoCapitalize={'none'} secureTextEntry={true} style={styles.textInput}></TextInput>
                <TextInput placeholder={"New password"} onChangeText={setNewPassword} autoCapitalize={'none'} secureTextEntry={true} style={styles.textInput}></TextInput>
                <TextInput placeholder={"Confirm password"} onChangeText={setConfirmPassword} autoCapitalize={'none'} secureTextEntry={true} style={styles.textInput}></TextInput>
                <Pressable
                    onPress={() => {changePassword(oldPassword, newPassword, confirmPassword); navigation.navigate("UserMenu")} }
                    style={styles.button}>
                    <Text style={styles.textStyle}>Change password</Text>
                </Pressable>
                <FooterWithoutAdd/>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    textInput: {
        fontSize: 20,
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 10
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        margin: 10,
        backgroundColor: Colors.fg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        elevation: 3,
    }
});

export default ChangePassword;