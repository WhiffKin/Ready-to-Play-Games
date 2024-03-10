import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCampaignArray, thunkGetCampaigns } from "../../../redux/campaign";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteCampaignModal from "./DeleteCampaignModal";
import SignupFormModal from "../../SignupFormModal";
import { useModal } from "../../../context/Modal";

function CampaignsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const campaigns = useSelector(selectCampaignArray());
    const {setModalContent} = useModal();

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
                <div key={campaign.id}>
                    <img src={campaign.sprite} alt={`${campaign.name} campaign sprite.`} />
                    <h1>{campaign.name}</h1>
                    <button 
                        onClick={() => alert("Feature coming soon!")}
                    >
                        Start Campaign
                    </button>
                    <button 
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                        Edit
                    </button>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteCampaignModal campaignId={campaign.id} navigate={navigate} />}
                    />
                    <h3>{campaign.description}</h3>
                </div>
            ))}
        </>
    )
}

export default CampaignsPage;