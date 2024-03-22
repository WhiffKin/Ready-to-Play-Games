import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCharArray, thunkGetCharacters } from "../../../redux/character";
import "./CharactersPage.css";

function CharactersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const characters = useSelector(selectCharArray());
    const [focusChar, setFocusChar] = useState(-.01);
    const [focusCharStep, setFocusCharStep] = useState(0);

    useEffect(() => {
        dispatch(thunkGetCharacters());
    }, [dispatch])

    useEffect(() => {
        if (focusChar != focusCharStep) {
            const timeOut = setTimeout(() => {
                let newFocus = (focusChar + Math.abs(focusChar - focusCharStep) / 32);
                if (focusChar > focusCharStep && newFocus < focusCharStep) setFocusChar(focusCharStep);
                else if (focusChar < focusCharStep && newFocus > focusCharStep) setFocusChar(focusCharStep);
                else setFocusChar(newFocus);
            }, 10);
            return () => clearTimeout(timeOut);
        }
    }, [focusChar, setFocusChar])

    useEffect(() => {
        const timeOut = setTimeout(() => setFocusCharStep((focusCharStep + 1)), 4000);
        return () => clearTimeout(timeOut);
    }, [focusCharStep, setFocusCharStep])

    if (!characters.length) return <h1>Loading Characters...</h1>
    return (
        <>
            {characters.map((character, index) => {
                const longDist = focusChar % characters.length - (index - characters.length);
                const highDist = focusChar - (index + Math.ceil(focusChar / characters.length) * characters.length);
                const lowDist = focusChar - (index + Math.floor(focusChar / characters.length) * characters.length);

                let dist;
                if (highDist < 2 && highDist > -2) dist = highDist; // handles end at ending of rotation
                if (lowDist < 2 && lowDist > -2) dist = lowDist; // handles center
                if (longDist < 2 && longDist >= -2) dist = longDist; // Handles end at the beginning of rotation
                if (!dist) return;
                return (
                    <div 
                        key={character.id} 
                        className="character_page-container cursor-pointer" 
                        onClick={() => navigate(`/characters/${character.id}`)}
                        style={{
                            "transform": `perspective(250px) 
                                          translate3D(${-dist * 350}px, 0, ${dist * dist * -50}px) 
                                          rotateY(${-dist / 2 * 30}deg)`,
                            "zIndex": Math.abs(dist) != 2 ? 2 : 1,
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