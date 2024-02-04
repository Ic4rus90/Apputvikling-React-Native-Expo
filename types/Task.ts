import {Timestamp} from "firebase/firestore";

/**
 * The interface of a task, defines how the task object looks like.
 * During changing of the returned object in the back-end, this needs to be updated
 */
export interface Task {
    completed: boolean,
    path: (string|null)[]
    creator: string,
    created: Timestamp,
    deadline: Timestamp|null,
    id: string,
    note: string,
    parentID: string|null,
    invited?: string[],
    shared?: boolean,
    title: string,
    userID: Array<string>,
    subtasksCount?: number,
}