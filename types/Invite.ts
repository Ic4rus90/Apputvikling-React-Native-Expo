/**
 * The interface of an invite, defines how the invite object looks like.
 * During changing of the returned object in the back-end, this needs to be updated
 */
export interface Invite {
    inviter: string,
    newUser: string,
    taskID: string
}