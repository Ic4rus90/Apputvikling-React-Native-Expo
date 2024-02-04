import {Platform, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import React, {useState} from "react";
import LoginOrRegisterScreen from "./screens/LoginOrRegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen"
import AuthContext from "./contexts/AuthContext";
import {navigationRef} from './modules/RootNavigation';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from "react-native-safe-area-context";
import 'react-native-gesture-handler';
import ChangePassword from "./screens/ChangePassword";
import TodaysTasksScreen from "./screens/TodaysTasksScreen";
import UserMenu from "./screens/UserMenu";
import InviteScreen from "./screens/InviteScreen";
import PersonalDataScreen from "./screens/PersonalDataScreen";
import * as NavigationBar from "expo-navigation-bar";
import {StatusBar} from "expo-status-bar";
import {Colors} from "./themes/Colors";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import {stat} from "react-native-fs";


// Authentication stack, containing screens shown to unauthenticated users.
const AuthenticationStack = createNativeStackNavigator();

const Stack = createNativeStackNavigator();


// Screens used by the authentication stack
function AuthenticationStackNavigator() {
    return (
        <PaperProvider>
            <AuthenticationStack.Navigator initialRouteName="Welcome">
                <AuthenticationStack.Screen
                    name="Welcome"
                    component={LoginOrRegisterScreen}
                    options={{headerShown: false}}
                />
                <AuthenticationStack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{headerShown: false}}
                />
                <AuthenticationStack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{headerShown: false}}
                />
                <AuthenticationStack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                    options={{headerShown: false}}
                />
                <AuthenticationStack.Screen
                    name="PrivacyPolicy"
                    component={PrivacyPolicyScreen}
                    options={{headerShown: false}}
                />
            </AuthenticationStack.Navigator>
        </PaperProvider>
    );
}

// Screens used by the main stack
function MainStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Tasks"
                component={TaskScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={"ChangePassword"}
                component={ChangePassword}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={"UserMenu"}
                component={UserMenu}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={"TodaysTasks"}
                component={TodaysTasksScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={"Invitations"}
                component={InviteScreen}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name={"PersonalData"}
                component={PersonalDataScreen}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    );
}


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const whenLogoutSuccess = () => {
        setIsAuthenticated(false);
    }

    const whenLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const whenUserDeleted = () => {
        setIsAuthenticated(false);
    };

    let statusBar : JSX.Element = null;
    if (Platform.OS === 'android') {
        NavigationBar.setBackgroundColorAsync(Colors.primary).catch(() => {});
        statusBar = <StatusBar style={Colors.theme}/>;
    } // Catch the error, and do nothing. This is not supported on iPhone


    return (
        <PaperProvider>
            {statusBar}
            <SafeAreaProvider>
                <AuthContext.Provider value={{whenLoginSuccess, whenLogoutSuccess, whenUserDeleted}}>
                    <NavigationContainer ref={navigationRef}>
                        {isAuthenticated ? <MainStackNavigator/> : <AuthenticationStackNavigator/>}
                    </NavigationContainer>
                </AuthContext.Provider>
            </SafeAreaProvider>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default App;