import { useState } from "react";
import randName from "./names";

function CreateCharacterPage() {
    const [sprite, setSprite] = useState("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png");    
    const [name, setName] = useState("");
    const [alignment, setAlignment] = useState("");
    const [charClass, setCharClass] = useState("");
    
    const [validation, setValidation] = useState({});

    const setRandName = e => {
        e.preventDefault();
        setName(randName());
    }

    const changeClass = e => {
        e.preventDefault();
        setCharClass(e.target.value);
        switch(e.target.value) {
            case "Monk":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png");
            case "Paladin":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Paladin.png");
            case "Ranger":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ranger.png");
            case "Sorcerer":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Sorcerer.png");
        }
    }

    return (
        <>
            <div> 
                <img src={sprite} alt="Character sprite preview"/>
                <form>
                    <h3>Character Details:</h3>
                    <label>
                        Name
                        <input
                            placeholder=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                        ></input>
                        <button onClick={setRandName}>Random</button>
                        <p>{validation.name && validation.name}</p>
                    </label>
                    <label>
                        Alignment
                        <select
                            type="select"
                            value={alignment}
                            onChange={e => setAlignment(e.target.value)}
                        >
                            <option value="Lawful_Good">Lawful Good</option>
                            <option value="Chaotic_Good">Chaotic Good</option>
                            <option value="Lawful_Neutral" defaultValue>Lawful Neutral</option>
                            <option value="Chaotic_Neutral">Chaotic Neutral</option>
                            <option value="Lawful_Evil">Lawful Evil</option>
                            <option value="Chaotic_Evil">Chaotic Evil</option>
                        </select>
                    </label>
                    <label>
                        Class
                        <select
                            type="select"
                            value={charClass}
                            onChange={changeClass}
                        >
                            <option value="Monk" defaultValue>Monk</option>
                            <option value="Paladin">Paladin</option>
                            <option value="Ranger">Ranger</option>
                            <option value="Sorcerer">Sorcerer</option>
                        </select>
                    </label>
                </form>
            </div>
        </>
    );
}

export default CreateCharacterPage;