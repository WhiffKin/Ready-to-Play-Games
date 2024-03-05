import { useState } from "react";

function CreateCampaignTemplate() {
    const [allRooms, setAllRooms] = useState([]);

    const [environPieces, setEnvironPieces] = useState({});
    const [name, setName] = useState("");
    const [backgroundSprite, setBackgroundSprite] = useState();

    function setEnvironPiece(e, location) {
        if (e.target.files && e.target.files[0])
            setEnvironPiece({
                ...environPieces,
                [location]: {
                    file: e.target.files[0],
                    url: URL.createObjectURL(e.target.file[0]),
                }
            });
    }

    function onSubmit(e) {
        e.preventDefault();

    }

    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </label>
                    <label>
                        {environPieces.wall && 
                            <img src={environPieces.wall.url}
                                alt="Wall Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "wall")}
                        />
                    </label>
                    <label>
                        {environPieces.back_left && 
                            <img src={environPieces.back_left.url}
                                alt="Back Left Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "back_left")}
                        />
                    </label>
                    <label>
                        {environPieces.back_center && 
                            <img src={environPieces.back_center.url}
                                alt="Back Center Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "back_center")}
                        />
                    </label>
                    <label>
                        {environPieces.back_right && 
                            <img src={environPieces.back_right.url}
                                alt="Back Right Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "back_right")}
                        />
                    </label>
                    <label>
                        {environPieces.obstacle && 
                            <img src={environPieces.obstacle.url}
                                alt="Obstacle Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "obstacle")}
                        />
                    </label>
                    <label>
                        {environPieces.front_left && 
                            <img src={environPieces.front_left.url}
                                alt="Front Left Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "front_left")}
                        />
                    </label>
                    <label>
                        {environPieces.front_center && 
                            <img src={environPieces.front_center.url}
                                alt="Front Center Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "front_center")}
                        />
                    </label>
                    <label>
                        {environPieces.front_right && 
                            <img src={environPieces.front_right.url}
                                alt="Front Right Environment Piece" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setEnvironPiece(e, "front_right")}
                        />
                    </label>
                </form>
            </div>
        </>
    )
}
export default CreateCampaignTemplate;