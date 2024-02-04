// TaskContext.js
import React, {createContext, useCallback, useContext, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

export const TaskContext = createContext(undefined);

export function updateTaskContext(parentID){
    const { setTaskContext } = useContext(TaskContext);
    useFocusEffect(useCallback(() => {setTaskContext(parentID)}, []));
}