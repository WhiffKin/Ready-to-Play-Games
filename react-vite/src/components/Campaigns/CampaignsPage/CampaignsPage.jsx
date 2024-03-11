import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCampaignArray, thunkGetCampaigns } from "../../../redux/campaign";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteCampaignModal from "./DeleteCampaignModal";
import "./CampaignsPage.css";
import UpdateCampaignPage from "../UpdateCampaignPage/UpdateCampaignPage";

function CampaignsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const campaigns = useSelector(selectCampaignArray());

    useEffect(() => {
        if (!user) navigate("/");
    })

    useEffect(() => {
        dispatch(thunkGetCampaigns());
    }, [user])

    console.log(campaigns)

    if (!campaigns.length) return <h1>Loading Campaigns...</h1>
    return (
        <>
            {campaigns.map(campaign => (
                <div 
                    key={campaign.id}
                    className="campaigns_page-campaign_container"
                >
                    <img src={campaign.backgroundSprite} alt={`${campaign.name} campaign sprite.`} />
                    <div>
                        <h1>{campaign.name}</h1>
                        <div>
                            <button 
                                onClick={() => alert("Feature coming soon!")}
                            >
                                Start Campaign
                            </button>
                            <OpenModalButton
                                buttonText="Edit"
                                modalComponent={<UpdateCampaignPage campaignId={campaign.id} />}
                            />
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteCampaignModal campaignId={campaign.id} navigate={navigate} />}
                            />
                        </div>
                        <h3>{campaign.description}</h3>
                    </div>
                </div>
            ))}
        </>
    )
}

export default CampaignsPage;