import { createSelector } from "reselect";

// Custom Selectors
export const selectCampaignArray = () => 
    createSelector(
        state => state.campaigns,
        campaigns => Object.values(campaigns)
    )
export const selectIndividualCampaign = id => 
    createSelector(
        state => state.campaigns,
        campaigns => campaigns[id]
    )

// Action Types
const ADD_CAMPAIGNS = "campaigns/ADD_CAMPAIGNS"
const ADD_CAMPAIGN = "campaigns/ADD_CAMPAIGN"
const DELETE_CAMPAIGN = "campaigns/DELETE_CAMPAIGN"

// Action Creators
const addCampaigns = campaigns => ({
    type: ADD_CAMPAIGNS,
    payload: campaigns
})
const addCampaign = campaign => ({
    type: ADD_CAMPAIGN,
    payload: campaign
})
const deleteCampaign = id => ({
    type: DELETE_CAMPAIGN,
    payload: id
})

// Thunks
export const thunkGetCampaigns = () => async dispatch => {
    const response = await fetch("/api/campaigns");
    
    const data = await response.json();
    if (response.ok) dispatch(addCampaigns(data));
    return data;
}

export const thunkGetCampaignById = id => async dispatch => {
    const response = await fetch(`/api/campaigns/${id}`);
    
    const data = await response.json();
    if (response.ok) dispatch(addCampaign(data));
    return data;
}

export const thunkPostCampaign = char => async dispatch => {
    const formData = new FormData();
    for (let key of Object.keys(char)) 
        formData.append(key, char[key]);

    const response = await fetch("/api/campaigns", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (response.ok) dispatch(addCampaign(data));
    return data;
}

export const thunkUpdateCampaign = char => async dispatch => {
    const charId = char.id;
    const formData = new FormData();
    for (let key of Object.keys(char)) 
        formData.append(key, char[key]);

    const response = await fetch(`/api/campaigns/${charId}`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (response.ok) dispatch(addCampaign(data));
    return data;
}

export const thunkDeleteCampaign = id => async dispatch => {
    const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();
    if (response.ok) dispatch(deleteCampaign(id));
    return data;
}

// Reducer
const initialState = {};
function campaignReducer(state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case ADD_CAMPAIGNS:
            return { ...newState, ...action.payload.campaigns.reduce((acc, campaign) => {
                acc[campaign.id] = campaign;
                return acc;
            }, {})};
        case ADD_CAMPAIGN:
            newState[action.payload.id] = action.payload;
            return newState;
        case DELETE_CAMPAIGN:
            delete newState[action.payload];
            return newState;
        default:
            return newState;
    }
}
export default campaignReducer;