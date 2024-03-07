import { createSelector } from "reselect";

// Custom Selectors
export const selectCharArray = () => 
    createSelector(
        state => state.characters,
        chars => Object.values(chars)
    )
export const selectIndividualChar = id => 
    createSelector(
        state => state.characters,
        chars => chars[id]
    )

// Action Types
const ADD_CHARS = "characters/ADD_CHARACTERS"
const ADD_CHAR = "characters/ADD_CHARACTER"
const DELETE_CHAR = "characters/DELETE_CHARACTER"

// Action Creators
const addChars = chars => ({
    type: ADD_CHARS,
    payload: chars
})
const addChar = char => ({
    type: ADD_CHAR,
    payload: char
})
const deleteChar = id => ({
    type: DELETE_CHAR,
    payload: id
})

// Thunks
export const thunkGetCharacters = () => async dispatch => {
    const response = await fetch("/api/characters");
    
    const data = await response.json();
    if (response.ok) dispatch(addChars(data));
    return data;
}

export const thunkGetCharacterById = id => async dispatch => {
    const response = await fetch(`/api/characters/${id}`);
    
    const data = await response.json();
    if (response.ok) dispatch(addChar(data));
    return data;
}

export const thunkPostCharacter = char => async dispatch => {
    const formData = new FormData();
    for (let key of Object.keys(char)) 
        formData.append(key, char[key]);

    const response = await fetch("/api/characters", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (response.ok) dispatch(addChar(data));
    return data;
}

export const thunkUpdateCharacter = char => async dispatch => {
    const charId = char.id;
    const formData = new FormData();
    for (let key of Object.keys(char)) 
        formData.append(key, char[key]);

    const response = await fetch(`/api/characters/${charId}`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (response.ok) dispatch(addChar(data));
    return data;
}

export const thunkDeleteCharacter = id => async dispatch => {
    const response = await fetch(`/api/characters/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();
    if (response.ok) dispatch(deleteChar(id));
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
        case DELETE_CHAR:
            delete newState[action.payload];
            return newState;
        default:
            return newState;
    }
}
export default characterReducer;