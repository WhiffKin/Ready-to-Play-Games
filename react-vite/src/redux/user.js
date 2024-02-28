const ADD_USERS = "users/ADD_USERS"

const addUser = (users) => ({
    action: ADD_USERS, 
    payload: users
})

const initialState = {}
export default userReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        default:
            return state;
    }
}