import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIndividualCampaign, thunkGetCampaignById } from "../../../redux/campaign";
import { useEffect } from "react";
import CreateCampaignPage from "../CreateCampaignPage";

function UpdateCampaignPage ({ campaignId }) {
    const dispatch = useDispatch();
    const campaign = useSelector(selectIndividualCampaign(campaignId));

    useEffect(() => {
        dispatch(thunkGetCampaignById(campaignId));
    }, [])

    if (!campaign) return <h1>Loading Details...</h1>
    return (
        <>
            <CreateCampaignPage editedCampaign={campaign} />
        </>
    )
}

export default UpdateCampaignPage;