import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCharArray, thunkGetCharacters } from "../../../redux/character";
import "./CharactersPage.css";

function CharactersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const characters = useSelector(selectCharArray());
    const [focusChar, setFocusChar] = useState(3)

    useEffect(() => {
        dispatch(thunkGetCharacters());
    }, [dispatch])

    useEffect(() => {
        const timeOut = setTimeout(() => setFocusChar((focusChar + .002)), 10)
        return () => clearTimeout(timeOut);
    }, [focusChar, setFocusChar, characters])

    if (!characters.length) return <h1>Loading Characters...</h1>
    return (
        <>
            {characters.map((character, index) => {
                const dist = (focusChar % characters.length - index) % characters.length;

                if (dist > 2 || dist < -2) return;
                return (
                    <div 
                        key={character.id} 
                        className="character_page-container cursor-pointer" 
                        onClick={() => navigate(`/characters/${character.id}`)}
                        style={{
                            "transform": `perspective(250px) 
                                          translate3D(${-dist * 350}px, 0, ${dist * dist * -50}px) 
                                          rotateY(${-dist / 2 * 32}deg)`,
                            "zIndex": Math.abs(dist) == 2 ? -2 : -1,
                        }}
                    >
                        <img src={character.sprite} alt={`${character.name} character sprite.`} />
                        <h3>{character.name}</h3>
                        <h5>{character.classType}</h5>
                    </div>
                );
                })}
        </>
    )
}

export default CharactersPage;