import { useEffect, useState } from "react";
import CreateRoomPage from "../CreateRoom";
import CreateTemplatePage from "../CreateTemplatePage";
import { useCampaignTemplateContext } from "../../../context/CampaignTemplate/CampaignTemplate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
                    onClick={() => setCurrentBuild("Template")}
                >Campaign Template</span>
                <span
                    onClick={() => setCurrentBuild("Rooms")}
                >Rooms</span>
            </> : 
            (currentBuild == "Template" ? 
            <CreateTemplatePage /> :
            <CreateRoomPage />
            ))}
        </div>
    )
}
export default CreateCampaignTemplate;