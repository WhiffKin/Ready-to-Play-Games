import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCharArray, thunkGetCharacters } from "../../../redux/character";

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
                <div key={character.id} onClick={() => navigate(`/characters/${character.id}`)}>
                    <img src={character.sprite} alt={`${character.name} character sprite.`} />
                    <span>{character.name}</span>
                    <span>{character.classType}</span>
                </div>
            ))}
        </>
    )
}

export default CharactersPage;