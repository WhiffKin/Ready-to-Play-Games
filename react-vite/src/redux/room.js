import { createSelector } from "reselect";

// Custom Selectors
export const selectRoomArray = () => 
    createSelector(
        state => state.rooms,
        rooms => Object.values(rooms)
    )
export const selectIndividualTemplate = id => 
    createSelector(
        state => state.rooms,
        rooms => rooms[id]
    )

// Action Types
const ADD_ROOMS = "rooms/ADD_ROOMS"
const ADD_ROOM = "rooms/ADD_ROOM"

// Action Creators
const addRooms = rooms => ({
    type: ADD_ROOMS,
    payload: rooms
})
const addRoom = room => ({
    type: ADD_ROOM,
    payload: room
})

// Thunks
export const thunkGetRooms = () => async dispatch => {
    const response = await fetch("/api/rooms");
    
    const data = await response.json();
    if (response.ok) dispatch(addRooms(data));
    return data;
}

export const thunkGetRoomById = id => async dispatch => {
    const response = await fetch(`/api/rooms/${id}`);
    
    const data = await response.json();
    if (response.ok) dispatch(addRoom(data));
    return data;
}

export const thunkPostRoom = room => async dispatch => {
    const formData = new FormData();
    for (let key of Object.keys(room)) 
        formData.append(key, room[key]);

    console.log(room)

    const response = await fetch("/api/rooms", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (response.ok) dispatch(addRoom(data))
    return data;
}

// Reducer
const initialState = {};
function roomReducer(state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case ADD_ROOMS:
            return { ...newState, ...action.payload.rooms.reduce((acc, char) => {
                acc[char.id] = char;
                return acc;
            }, {})};
        case ADD_ROOM:
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return newState;
    }
}
export default roomReducer;