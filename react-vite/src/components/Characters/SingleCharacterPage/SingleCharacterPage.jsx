import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIndividualChar, thunkGetCharacterById } from "../../../redux/character";

const SingleCharacterPage = () => {
    const { charId } = useParams();
    const dispatch = useDispatch();
    const char = useSelector(selectIndividualChar(charId));
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetCharacterById(charId));
    }, [])

    if (!char && !char?.strength) return <h1>Loading char...</h1>
    return (
        <>
            <div>
                <img src={char.sprite} alt={`${char.name}'s sprite.`} />
                <div>
                    <h1>{char.name}</h1>
                    <h3>Class: {char.classType}</h3>
                    <h3>Alignment: {char.alignment}</h3>
                </div>
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
                            onClick={() => alert("Edit Character")}
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => alert("Delete Character")}
                        >
                            Delete
                        </button>
                    </>}
                </div>
            </div>
            <h3>Description</h3>
            <span>{char.description}</span>
            <h3>Stats</h3>
            <p>Strength: {char.strength}</p>
            <p>Dexterity: {char.dexterity}</p>
            <p>Wisdom: {char.wisdom}</p>
            <p>Charisma: {char.charisma}</p>
            <p>Experience: {char.experience}</p>
        </>
    )
}

export default SingleCharacterPage;