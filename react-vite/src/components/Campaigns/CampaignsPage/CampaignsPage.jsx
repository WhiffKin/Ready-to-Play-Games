import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
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
    const [didFind, setDidFind] = useState(true);

    useEffect(() => {
        if (!user) navigate("/");
    })

    useEffect(() => {
        checkForCampaigns();
    }, [user])

    async function checkForCampaigns() {
        const res = await dispatch(thunkGetCampaigns());
        console.log(res)
        if (!res.campaigns.length) setDidFind(false);
    }

    console.log(campaigns)

    if (!didFind) return <h1>No campaigns, try <NavLink to="/templates">starting a campaign!</NavLink></h1>
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