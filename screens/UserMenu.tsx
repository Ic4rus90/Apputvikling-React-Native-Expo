import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Header from "../components/Header";
import {auth} from "../firebaseConfig";
import AuthContext from "../contexts/AuthContext";
import {logoutUser, deleteTheUser, requestPersonalData} from "../services/Account";
import {Button, Dialog, Portal, Provider } from 'react-native-paper';
import {Colors} from "../themes/Colors";
import {FooterWithoutAdd} from "../components/Footer";

const UserMenu = ({navigation }) => {

    const {whenLogoutSuccess, whenUserDeleted} = useContext(AuthContext);
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    return (
    <Provider>
        <View>
            <Header title={"User Menu"} navigation={navigation}/>
            <Text style={styles.headerTextStyle}>Your Account</Text>
            <View style={styles.container}>
                <Text></Text>
                <Pressable
                        style={styles.button}
                        onPress= {() => navigation.navigate("Invitations")}>
                        <Text style={styles.textStyle}>Invitations</Text>
                </Pressable>
                <Pressable
                        style={styles.button}
                        onPress= {() => navigation.navigate("ChangePassword")}>
                        <Text style={styles.textStyle}>Change password</Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress= {() => logoutUser(whenLogoutSuccess)}>
                    <Text style={styles.textStyle}>Log out</Text>
                </Pressable>
                <Pressable style={styles.button} onPress= {() => navigation.navigate("PersonalData")}>
                    <Text style={styles.textStyle}>Request personal data</Text>
                </Pressable>
                <Pressable
                    style={{...styles.button, backgroundColor: Colors.red}}
                    onPress= {showDialog}>
                    <Text style={styles.textStyle}>Delete user</Text>
                </Pressable>

                <Portal>
                    <Dialog style={styles.dialog} visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title style={styles.dialogTitle}>Confirm deletion of user</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to delete your account?</Text>
                            <Text style={{color: Colors.red}}>Once deleted, there is no going back!</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}><Text style={{color: Colors.primary}}>Cancel</Text></Button>
                            <Button onPress={() => {hideDialog(); deleteTheUser(whenUserDeleted)}}><Text style={{color: Colors.red}}>Delete</Text></Button>
                        </Dialog.Actions>
                    </Dialog>
                    <FooterWithoutAdd/>
                </Portal>
            </View>
        </View>
    </Provider>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
        margin: 10,
        height: 40,
    },
    dialog: {
        backgroundColor: Colors.bg
    },
    container: {
        height: "100%",
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dialogTitle: {
        color: Colors.fg
    },
    headerTextStyle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 25,
        textAlign: "center"
    }

});

export default UserMenu;