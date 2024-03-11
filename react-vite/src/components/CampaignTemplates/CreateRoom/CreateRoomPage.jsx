import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkPostRoom } from "../../../redux/room";
import { useCampaignTemplateContext } from "../../../context/CampaignTemplate/CampaignTemplate";
import { isPhotoFile } from "../../../helperFuncs";

function CreateRoomPage() {
    const dispatch = useDispatch();
    
    const { setReset } = useCampaignTemplateContext();
    
    const [validation, setValidation] = useState({});
    const [environPieces, setEnvironPieces] = useState({});
    const [name, setName] = useState("");
    const [backgroundSprite, setBackgroundSprite] = useState({});
    const [showRoom, setShowRoom] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);

    function setEnvironPieceFunc(e, location) {
        if (e.target.files && e.target.files[0])
            setEnvironPieces({
                ...environPieces,
                [location]: {
                    file: e.target.files[0],
                    url: URL.createObjectURL(e.target.files[0]),
                }
            });
    }

    function setBackgroundSpriteFunc(e) {
        if (e.target.files && e.target.files[0])
            setBackgroundSprite({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),   
            });
    }

    function startRoom(e) {
        e.preventDefault();

        const newValid = {};
        if (!name.length) newValid.name = "Name is required.";
        if (!backgroundSprite?.file) newValid.backgroundSprite = "Background Sprite is required.";
        if (!isPhotoFile(backgroundSprite?.file?.name)) newValid.backgroundSprite = "Background sprite must be a photo."

        // Unsuccessful validation.
        if (Object.values(newValid).length) return setValidation(newValid);

        setShowRoom(true);
    }

    function clearRoomFields() {
        setValidation({})
        setEnvironPieces({})
        setName("")
        setBackgroundSprite()
        setShowRoom(false)
        setCanSubmit(true)
    }

    const onSubmit = async e => {
        e.preventDefault();
        console.log("Submission")

        // Validation
        const newValid = {};
        if (!name.length) newValid.name = "Name is required.";
        if (!backgroundSprite) newValid.backgroundSprite = "Background Sprite is required.";

        for (let key in environPieces) 
            if (!isPhotoFile(environPieces[key].file.name)) {
                environPieces[key] = null;
                newValid.pieces = "One or more pieces was a bad file type, it has been removed."
            }

        console.log(newValid)
        // Unsuccessful validation.
        if (Object.values(newValid).length) return setValidation(newValid);

        const payload = {
            name,
            background_sprite: backgroundSprite.file,
        }
        for (let key in environPieces)
            payload[key] = environPieces[key].file;

        // Submission
        const response = await dispatch(thunkPostRoom(payload));

        // Unsuccessful Submission
        if (response.errors) { 
            setValidation(response.errors);
            setCanSubmit(true);
            return;
        }

        // Successful Submission
        setReset(true);
    }

    return (
        <div>
            {!showRoom ? 
            <>
                <div className="create_campaign_temp-form">
                    <label>
                        <span>Name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <p>{validation.name && validation.name}</p>
                    </label>
                    <label>
                        <span>Background Image</span>
                        <img 
                            className="cursor-pointer"
                            src={backgroundSprite.url ? 
                                    backgroundSprite.url : 
                                    "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"
                                }
                        />
                        <input
                            className="default-hidden"
                            type="file"
                            accept="image/*"
                            onChange={setBackgroundSpriteFunc}
                        />
                        <p>{validation.backgroundSprite && validation.backgroundSprite}</p>
                    </label> 
                    <button 
                        onClick={startRoom}
                    >
                        Create Room
                    </button>
                </div>
            </> :
            <form onSubmit={onSubmit}
                id="create_room-room_form"
            >
                <div
                    className="create_room-room_card"
                >
                    <div>
                        <img 
                            className="create_room-floor"
                            src={backgroundSprite.url ? 
                                    backgroundSprite.url : 
                                    "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"
                                }
                        />
                        <label>
                            <img
                                className="create_room-piece_wall"
                                src={environPieces.wall ? environPieces.wall.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Wall Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "wall")}
                            />
                        </label>
                        <label>
                            <img 
                                className="create_room-piece_back_left"
                                src={environPieces.back_left ? environPieces.back_left.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Back Left Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "back_left")}
                            />
                        </label>
                        <label>
                            <img 
                                className="create_room-piece_back_center"
                                src={environPieces.back_center ? environPieces.back_center.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Back Center Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "back_center")}
                            />
                        </label>
                        <label>
                            <img 
                                className="create_room-piece_back_right"
                                src={environPieces.back_right ? environPieces.back_right.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Back Right Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "back_right")}
                            />
                        </label>
                        <label>
                            <img 
                                className="create_room-piece_front_left"
                                src={environPieces.front_left ? environPieces.front_left.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Front Left Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "front_left")}
                            />
                        </label>
                        <label>
                            <img 
                                className="create_room-piece_front_center"
                                src={environPieces.front_center ? environPieces.front_center.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Front Center Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "front_center")}
                            />
                        </label>
                        <label>
                            <img 
                                className="create_room-piece_front_right"
                                src={environPieces.front_right ? environPieces.front_right.url : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/add+photo.png"}
                                alt="Front Right Environment Piece" />
                            <input
                                className="default-hidden"
                                type="file"
                                accept="image/*"
                                onChange={e => setEnvironPieceFunc(e, "front_right")}
                            />
                        </label>
                    </div>
                    <label>
                        <p>{validation.pieces && validation.pieces}</p>
                    </label>
                </div>
                <button 
                    disabled={!canSubmit}
                    type="submit" 
                >Submit</button>
            </form>
            }
        </div>
    )
}

export default CreateRoomPage;