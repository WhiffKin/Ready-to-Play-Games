import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkPostRoom } from "../../../redux/room";
import { useCampaignTemplateContext } from "../../../context/CampaignTemplate/CampaignTemplate";

function CreateRoomPage() {
    const dispatch = useDispatch();
    
    const { setReset } = useCampaignTemplateContext();
    
    const [validation, setValidation] = useState({});
    const [environPieces, setEnvironPieces] = useState({});
    const [name, setName] = useState("");
    const [backgroundSprite, setBackgroundSprite] = useState();
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
        if (!backgroundSprite) newValid.backgroundSprite = "Background Sprite is required.";

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

        // Validation
        const newValid = {};
        if (!name.length) newValid.name = "Name is required.";
        if (!backgroundSprite) newValid.backgroundSprite = "Background Sprite is required.";

        // Unsuccessful validation.
        if (Object.values(newValid).length) return setValidation(newValid);

        const payload = {
            name,
            background_sprite: backgroundSprite.file,
        }
        console.log(environPieces)
        for (let key in environPieces){console.log(key);
            payload[key] = environPieces[key].file;}

        // Submission
        const response = await dispatch(thunkPostRoom(payload));

        // Unsuccessful Submission
        if (response.errors) { 
            setValidation(response.errors);
            setCanSubmit(true);
            return;
        }

        // Successful Submission
        clearRoomFields();
        setReset(true);
    }

    return (
        <div>
            {!showRoom ? 
            <>
                <div>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <p>{validation.name && validation.name}</p>
                    </label>
                    <label>
                        Choose a background for this room.
                        <input
                            type="file"
                            accept="image/*"
                            onChange={setBackgroundSpriteFunc}
                        />
                    </label> 
                </div>
                <button 
                    onClick={startRoom}
                >
                    {"->"}
                </button>
            </> :
            <form onSubmit={onSubmit}>
                <label>
                    {environPieces.wall && 
                        <img src={environPieces.wall.url}
                            alt="Wall Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "wall")}
                    />
                </label>
                <label>
                    {environPieces.back_left && 
                        <img src={environPieces.back_left.url}
                            alt="Back Left Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "back_left")}
                    />
                </label>
                <label>
                    {environPieces.back_center && 
                        <img src={environPieces.back_center.url}
                            alt="Back Center Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "back_center")}
                    />
                </label>
                <label>
                    {environPieces.back_right && 
                        <img src={environPieces.back_right.url}
                            alt="Back Right Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "back_right")}
                    />
                </label>
                <label>
                    {environPieces.obstacle && 
                        <img src={environPieces.obstacle.url}
                            alt="Obstacle Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "obstacle")}
                    />
                </label>
                <label>
                    {environPieces.front_left && 
                        <img src={environPieces.front_left.url}
                            alt="Front Left Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "front_left")}
                    />
                </label>
                <label>
                    {environPieces.front_center && 
                        <img src={environPieces.front_center.url}
                            alt="Front Center Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "front_center")}
                    />
                </label>
                <label>
                    {environPieces.front_right && 
                        <img src={environPieces.front_right.url}
                            alt="Front Right Environment Piece" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEnvironPieceFunc(e, "front_right")}
                    />
                </label>
                <button type="submit" disabled={!canSubmit}>Submit</button>
            </form>
            }
        </div>
    )
}

export default CreateRoomPage;