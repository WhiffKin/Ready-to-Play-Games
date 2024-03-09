import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCharArray, thunkGetCharacters } from "../../../redux/character";
import "./CharactersPage.css";

function CharactersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const characters = useSelector(selectCharArray());

    useEffect(() => {
        dispatch(thunkGetCharacters());
    }, [])

    if (!characters.length) return <h1>Loading Characters...</h1>
    return (
        <>
            {characters.map(character => (
                <div key={character.id} className="character_page-container" onClick={() => navigate(`/characters/${character.id}`)}>
                    <img src={character.sprite} alt={`${character.name} character sprite.`} />
                    <h3>{character.name}</h3>
                    <h5>{character.classType}</h5>
                </div>
            ))}
        </>
    )
}

export default CharactersPage;