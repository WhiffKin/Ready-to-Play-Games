import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIndividualTemplate, thunkGetTemplateById } from "../../../redux/campaignTemplates";

const SingleCampaignTemplatePage = () => {
    const { tempId } = useParams();
    const dispatch = useDispatch();
    const temp = useSelector(selectIndividualTemplate(tempId));
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetTemplateById(tempId));
    }, [])

    if (!temp && !temp?.name) return <h1>Loading Campaign Template Details...</h1>;
    return (
        <>
            <div>
                <img src={temp.sprite} alt={`${temp.name}'s sprite.`} />
                <div>
                    <h1>{temp.name}</h1>
                </div>
                <div>
                    <button 
                        onClick={() => alert("Run campaign not implemented.")} 
                        disabled={!user}
                    >
                        Run Campaign
                    </button>
                </div>
            </div>
            <h3>Rooms</h3>
            {temp.rooms.map(room => (
                <div key={room.id}>
                    <div>
                        {/* TODO: add room rendering */}                        
                    </div>
                    <span>{room.name}</span>
                </div>
            ))}
        </>
    );
}

export default SingleCampaignTemplatePage;