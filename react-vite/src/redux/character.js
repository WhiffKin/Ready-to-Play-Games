import { createSelector } from "reselect";

// Custom Selectors
export const selectCharArray = () => 
    createSelector(
        state => state.characters,
        chars => Object.values(chars)
    )

// Action Types
const ADD_CHARS = "characters/ADD_CHARACTERS"

// Action Creators
const addChars = (chars) => ({
    type: ADD_CHARS,
    payload: chars
})

// Thunks
export const thunkAddCharacters = () => async (dispatch) => {
    const response = await fetch("/api/characters");
    
    const data = await response.json();
    if (response.ok) {
        const chars = await dispatch(addChars(data));
        return chars;
    }
    return data;
}

// Reducer
const initialState = {};
function characterReducer(state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case ADD_CHARS:
            return { ...action.payload.characters.reduce((acc, char) => {
                acc[char.id] = char;
                return acc;
            }, {})}
        default:
            return newState;
    }
}
export default characterReducer;