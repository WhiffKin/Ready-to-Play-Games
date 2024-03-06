import { useContext, useEffect, useState } from "react";
import CreateRoomPage from "../CreateRoom";
import CreateTemplatePage from "../CreateTemplatePage";
import { useCampaignTemplateContext } from "../../../context/CampaignTemplate/CampaignTemplate";

function CreateCampaignTemplate() {
    const { reset, setReset } = useCampaignTemplateContext();
    const [currentBuild, setCurrentBuild] = useState("");

    function onSubmit(e) {
        e.preventDefault(); 
    }

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