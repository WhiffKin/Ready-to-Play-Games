import { createSelector } from "reselect";

// Custom Selectors
export const selectTemplateArray = () => 
    createSelector(
        state => state.campaignTemps,
        chars => Object.values(chars)
    )
export const selectIndividualTemplate = id => 
    createSelector(
        state => state.campaignTemps,
        chars => chars[id]
    )

// Action Types
const ADD_TEMPS = "characters/ADD_TEMPLATES"
const ADD_TEMP = "characters/ADD_TEMPLATE"

// Action Creators
const addTemps = temps => ({
    type: ADD_TEMPS,
    payload: temps
})
const addTemp = temp => ({
    type: ADD_TEMP,
    payload: temp
})

// Thunks
export const thunkGetTemplates = () => async dispatch => {
    const response = await fetch("/api/templates");
    
    const data = await response.json();
    if (response.ok) dispatch(addTemps(data));
    return data;
}

export const thunkGetTemplateById = id => async dispatch => {
    const response = await fetch(`/api/templates/${id}`);
    
    const data = await response.json();
    if (response.ok) dispatch(addTemp(data));
    return data;
}

export const thunkPostTemplate = temp => async dispatch => {
    const formData = new FormData();
    for (let key of Object.keys(temp)) 
        formData.append(key, temp[key]);

    const response = await fetch("/api/templates", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (response.ok) dispatch(addChar(data));
    return data;
}

// Reducer
const initialState = {};
function campaignTempReducer(state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case ADD_TEMPS:
            return { ...newState, ...action.payload.templates.reduce((acc, char) => {
                acc[char.id] = char;
                return acc;
            }, {})};
        case ADD_TEMP:
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return newState;
    }
}
export default campaignTempReducer;