import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectIndividualChar, thunkGetCharacterById } from "../../../redux/character";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteCharModal from "./DeleteCharacterModal";
import "./SingleCharacterPage.css";

const SingleCharacterPage = () => {
    const { charId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const char = useSelector(selectIndividualChar(charId));
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetCharacterById(charId));
    }, [])

    if (!char && !char?.strength) return <h1>Loading Character Details...</h1>;
    return (
        <>
            <div className="single_character_page-container">
                <div className="single_character_page-header">
                    <img src={char.sprite} alt={`${char.name}'s sprite.`} />
                    <div>
                        <h1>{char.name}</h1>
                        <h3>Class: {char.classType}</h3>
                        <h3>Alignment: {char.alignment}</h3>
                        <div>
                            <button 
                                onClick={() => alert("Add character to user not implemented")} 
                                disabled={!user}
                            >
                                Add Character
                            </button>
                            {user && user.id == char.userId &&
                            <>
                                <button 
                                    onClick={() => navigate(`/characters/${charId}/update`)}
                                >
                                    Edit
                                </button>
                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeleteCharModal charId={charId} navigate={navigate} />}
                                />
                            </>}
                        </div>
                    </div>
                    <div id="single_character_page-stats">
                        <h1>Stats:</h1>
                        <div>
                            <p>Strength: {char.strength}</p>
                            <p>Dexterity: {char.dexterity}</p>
                            <p>Wisdom: {char.wisdom}</p>
                            <p>Charisma: {char.charisma}</p>
                        </div>
                    </div>
                    <div id="single_character_page-experience_bar">
                        {`Lvl. ${Math.floor(Math.sqrt(char.experience/2))}`}
                        <div>
                            <div style={{
                                width: `${(Math.sqrt(char.experience/2)% 1) * 100}%`
                            }}/>
                        </div>
                    </div>
                </div>
                <h5>{char.description}</h5>
            </div>
        </>
    );
}

export default SingleCharacterPage;