import { createSelector } from "reselect";

// Custom Selectors
export const selectIndividualUser = (userId) => 
    createSelector(
        state => state.users,
        users => users[userId]
    );
export const selectUserArray = () => 
    createSelector(
        state => state.users,
        users => Object.values(users)
    );

// Action Strings
const ADD_USERS = "users/ADD_USERS";
const ADD_USER = "users/ADD_USER";

// Action Creators
const addUsers = (users) => ({
    type: ADD_USERS, 
    payload: users
})
const addUser = (user) => ({
    type: ADD_USER,
    payload: user
})

// Thunks
export const thunkAddUsers = () => async (dispatch) => {
    const response = await fetch("/api/users");

    const data = await response.json();
    if (response.ok) {
        const users = await dispatch(addUsers(data));
        return users;
    }
    return data;
}
export const thunkAddUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}`);

    const data = await response.json();
    if (response.ok) {
        const user = await dispatch(addUser(data));
        return user;
    }
    return data;
}

// Reducer
const initialState = {}
function userReducer (state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case ADD_USER:
            newState[action.payload.id] = action.payload;
            return newState;
        case ADD_USERS:
            return { ...action.payload.users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc
            }, {}) };
        default:
            return state;
    }
}
export default userReducer;