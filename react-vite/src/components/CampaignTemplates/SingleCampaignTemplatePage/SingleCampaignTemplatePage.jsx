import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIndividualTemplate, thunkGetTemplateById } from "../../../redux/campaignTemplate";
import CreateCampaignPage from "../../Campaigns/CreateCampaignPage";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import "./SingleCampaignTemplatePage.css";

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
        <div className="campaign_template">
            <div className="campaign_template-header">
                <img src={temp.backgroundSprite} alt={`${temp.name}'s sprite.`} />
                <div>
                    <h1>{temp.name}</h1>
                    {user &&
                    <OpenModalButton
                        buttonText="Run Campaign"
                        modalComponent={<CreateCampaignPage template={temp} />}
                    />}
                </div>
                
            </div>
            <div className="campaign_template-room_container">
                {temp.rooms?.map(room => (
                    <div 
                        key={room.id}
                        className="campaign_template-room_card"
                    >
                        <div>
                            <img 
                                src={room.backgroundSprite}
                                className={`campaign_template-room-floor`}
                            />
                            {room.pieces.map(piece => 
                                <div key={piece.id}>
                                    <img 
                                        src={piece.sprite}
                                        className={`campaign_template-room-${piece.location}`}
                                    />
                                    <img 
                                        src={piece.sprite}
                                        className={`campaign_template-room-${piece.location}`}
                                    />
                                </div>)
                            }                       
                        </div>
                        <span>{room.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SingleCampaignTemplatePage;