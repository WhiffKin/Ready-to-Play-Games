import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectTemplateArray, thunkGetTemplates } from "../../../redux/campaignTemplate";
import "./CampaignTemplatesPage.css"

function CampaignTemplatesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const templates = useSelector(selectTemplateArray());

    useEffect(() => {
        dispatch(thunkGetTemplates());
    }, [])

    if (!templates.length) return <h1>Loading Campaign Templates...</h1>
    return (
        <>
            {templates.map(template => (
                <div 
                    key={template.id} 
                    className={`camp_template-container cursor-pointer`}
                    onClick={() => navigate(`/templates/${template.id}`)}
                >
                    <img 
                        className="default-image"
                        src={template.backgroundSprite} 
                        alt={`${template.name} campaign template preview picture.`} 
                    />
                    <div>
                        <h3>{template.name}</h3>
                        <span>Lvl. {template.recLevel} &bull; {template.numRooms} Rooms</span>
                    </div>
                </div>
            ))}
        </>
    )
}

export default CampaignTemplatesPage;