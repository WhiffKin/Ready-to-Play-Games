import { useEffect, useState } from "react";
import CreateRoomPage from "../CreateRoom";
import CreateTemplatePage from "../CreateTemplatePage";
import { useCampaignTemplateContext } from "../../../context/CampaignTemplate/CampaignTemplate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./CreateCampaignTemplate.css"

function CreateCampaignTemplate() {
    const navigate = useNavigate();
    const { reset, setReset } = useCampaignTemplateContext();
    const [currentBuild, setCurrentBuild] = useState("");
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        if (!user) navigate("/");
    })
    
    useEffect(() => {
        if (reset){
            setCurrentBuild("");
            setReset(false);
        }
    }, [reset, setReset, setCurrentBuild]);

    return (
        <div
            className="create_campaign_temp-container"
            onMouseLeave={() => {
                if (currentBuild == "Looking") setCurrentBuild("");
            }}
        >
            {!currentBuild ? 
            <span
                onMouseEnter={() => setCurrentBuild("Looking")}
            >Create A Campaign</span> :
            (currentBuild == "Looking" ? 
            <>
                <span
                    className="cursor-pointer" 
                    onClick={() => setCurrentBuild("Template")}
                >Campaign Template</span>
                <span
                    className="cursor-pointer" 
                    onClick={() => setCurrentBuild("Rooms")}
                >Rooms</span>
            </> : 
            (currentBuild == "Template" ? 
            <CreateTemplatePage /> :
            <CreateRoomPage />
            ))}
            {currentBuild && currentBuild != "Looking" &&
            <button
                onClick={() => setCurrentBuild("Looking")}
            >Cancel</button>}
        </div>
    )
}
export default CreateCampaignTemplate;