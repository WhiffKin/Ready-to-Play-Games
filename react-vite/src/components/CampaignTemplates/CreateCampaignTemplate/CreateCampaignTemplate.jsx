import { useState } from "react";
import CreateRoomPage from "../CreateRoom";
import CreateTemplatePage from "../CreateTemplatePage";

function CreateCampaignTemplate() {
    const [allRooms, setAllRooms] = useState([]);
    const [currentBuild, setCurrentBuild] = useState("")

    function onSubmit(e) {
        e.preventDefault(); 
    }

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