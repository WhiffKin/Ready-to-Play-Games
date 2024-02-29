import { createSelector } from "reselect";

// Custom Selectors
export const selectCharArray = () => 
    createSelector(
        state => state.characters,
        chars => Object.values(chars)
    )
export const selectIndividualChar = (id) => 
    createSelector(
        state => state.characters,
        chars => chars[id]
    )

// Action Types
const ADD_CHARS = "characters/ADD_CHARACTERS"
const ADD_CHAR = "characters/ADD_CHARACTER"

// Action Creators
const addChars = (chars) => ({
    type: ADD_CHARS,
    payload: chars
})
const addChar = (char) => ({
    type: ADD_CHAR,
    payload: char
})

// Thunks
export const thunkGetCharacters = () => async (dispatch) => {
    const response = await fetch("/api/characters");
    
    const data = await response.json();
    if (response.ok) {
        const chars = await dispatch(addChars(data));
        return chars;
    }
    return data;
}

export const thunkGetCharacterById = (id) => async (dispatch) => {
    const response = await fetch(`/api/characters/${id}`);
    
    const data = await response.json();
    if (response.ok) {
        const chars = await dispatch(addChar(data));
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
            return { ...newState, ...action.payload.characters.reduce((acc, char) => {
                acc[char.id] = char;
                return acc;
            }, {})};
        case ADD_CHAR:
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return newState;
    }
}
export default characterReducer;