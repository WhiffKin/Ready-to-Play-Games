import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { chooseRandElem } from "../../../helperFuncs";
import names from "./names";
import { thunkPostCharacter, thunkUpdateCharacter } from "../../../redux/character";
import SignupFormModal from "../../SignupFormModal";
import { useModal } from "../../../context/Modal";

function CreateCharacterPage({ editedChar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setModalContent } = useModal();
    const user = useSelector(state => state.session.user);

    const [custSprite, setCustSprite] = useState();
    const [sprite, setSprite] = useState(editedChar ? editedChar.sprite : "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png");    
    const [name, setName] = useState(editedChar ? editedChar.name : "");
    const [alignment, setAlignment] = useState(editedChar ? editedChar.alignment : "Lawful_Neutral");
    const [charClass, setCharClass] = useState("Monk");
    const [description, setDescription] = useState(editedChar ? editedChar.description : "");
    const [str, setStr] = useState(editedChar ? editedChar.strength : 10);
    const [dex, setDex] = useState(editedChar ? editedChar.dexterity : 10);
    const [wis, setWis] = useState(editedChar ? editedChar.wisdom : 10);
    const [cha, setCha] = useState(editedChar ? editedChar.charisma : 10);
    
    const [validation, setValidation] = useState({});
    const [canSubmit, setCanSubmit] = useState(true);

    useEffect(() => {
        if (editedChar) {
            setCharClass(editedChar.classType);
            if (!["https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png",
                  "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Paladin.png",
                  "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ranger.png",
                  "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Sorcerer.png"]
                  .includes(editedChar.sprite)) setCustSprite(true);
        }
    }, [])

    useEffect(() => {
        if (!user) setModalContent(<SignupFormModal />);
    })

    // Set new Sprite
    function onImageChange(e) {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setCustSprite(e.target.files[0]);
            setSprite(url)
        }
    }

    // Set a random name from a list of names
    const setRandName = e => {
        e.preventDefault();
        setName(chooseRandElem(names));
    }

    // Change class and sprite iff sprite is default
    const changeClass = (e, value) => {
        e.preventDefault();
        setCharClass(value);
        if (custSprite) return;
        switch(value) {
            case "Monk":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png");
                break;
            case "Paladin":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Paladin.png");
                break;
            case "Ranger":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ranger.png");
                break;
            case "Sorcerer":
                setSprite("https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Sorcerer.png");
                break;
        }
    }

    // Increment stats iff the total is within 40 (base level stat points)
    const incrementStats = (e, type) => {
        const val = e.target.value;
        if (val > 20 || val < 0) return;
        
        let max = 40 + (editedChar ? Math.floor(Math.sqrt(editedChar.experience / 2)) : 0)
        let total = str + dex + wis + cha;
        switch(type) {
            case "str":
                total += val - str;
                if (total <= max) return setStr(parseInt(val));
                break;
            case "dex":
                total += val - dex;
                if (total <= max) return setDex(parseInt(val));
                break;
            case "wis":
                total += val - wis;
                if (total <= max) return setWis(parseInt(val));
                break;
            case "cha":
                total += val - cha;
                if (total <= max) return setCha(parseInt(val));
                break;
        }
        return setValidation({...validation, stats: "Stats are maxxed out"});
    }

    // Sets all fields to a random value
    // TODO: implement gpt call for desc randomizing
    const randomize = e => {
        setRandName(e); // handles prevent default
        setAlignment(chooseRandElem(
           ["Lawful_Good",
            "Chaotic_Good",
            "Lawful_Neutral",
            "Chaotic_Neutral",
            "Lawful_Evil",
            "Chaotic_Evil"]
        ));
        changeClass(e, chooseRandElem(
           ["Monk",
            "Paladin",
            "Ranger",
            "Sorcerer"]
        ));

        const newStats = [0,0,0,0];
        for (let i = 0; i < 40; i++)
            newStats[Math.floor(Math.random() * 4)]++;

        setStr(newStats[0]);
        setDex(newStats[1]);
        setWis(newStats[2]);
        setCha(newStats[3]);
    }

    // Form submission
    const onSubmit = async e => {
        e.preventDefault();
        setCanSubmit(false);

        // Validations
        const newValid = {};
        if (name.length < 2) newValid.name = "Name must have a minimum length of 2."
        if (str + dex + wis + cha < 40) newValid.stats = "There are still remaining stat points."

        // Unsuccessful validation
        if (Object.values(newValid).length) {
            setCanSubmit(true);
            return setValidation(newValid);
        }

        const payload = {
            name: `${user.username},${name}`,
            alignment,
            classType: charClass,
            strength: str,
            dexterity: dex,
            wisdom: wis,
            charisma: cha,
            description,
        } 
        if (custSprite && custSprite !== true) payload.sprite = custSprite;
        if (editedChar) payload.id = editedChar.id;

        // Submission
        const response = await dispatch(editedChar ? thunkUpdateCharacter(payload) : thunkPostCharacter(payload))

        // Unsuccessful Submission
        if (response.errors) { 
            setValidation(response.errors);
            setCanSubmit(true);
            return;
        }

        // Successful Submission
        navigate(`/characters/${response.id}`);
    }

    return (
        <>
            <div> 
                <label>
                    <img src={sprite} alt="Character sprite preview"/>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                    />
                </label>
                <form 
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                >
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
                        <p>{validation.alignment && validation.alignment}</p>
                    </label>
                    <label>
                        Class
                        <select
                            type="select"
                            value={charClass}
                            onChange={e => changeClass(e, e.target.value)}
                        >
                            <option value="Monk" defaultValue>Monk</option>
                            <option value="Paladin">Paladin</option>
                            <option value="Ranger">Ranger</option>
                            <option value="Sorcerer">Sorcerer</option>
                        </select>
                        <p>{validation.classType && validation.classType}</p>
                    </label>
                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></textarea>
                    </label>
                    <h3>Character Stats:</h3>
                    <label>
                        Strength
                        <input
                            type="number"
                            value={str}
                            onChange={e => incrementStats(e, "str")}
                        ></input>
                    </label>
                    <label>
                        Dexterity
                        <input
                            type="number"
                            value={dex}
                            onChange={e => incrementStats(e, "dex")}
                        ></input>
                    </label>
                    <label>
                        Wisdom
                        <input
                            type="number"
                            value={wis}
                            onChange={e => incrementStats(e, "wis")}
                        ></input>
                    </label>
                    <label>
                        Charisma
                        <input
                            type="number"
                            value={cha}
                            onChange={e => incrementStats(e, "cha")}
                        ></input>
                    </label>
                    <h5>Stat points left: {40 + (editedChar ? Math.floor(Math.sqrt(editedChar.experience / 2)) : 0) - str - wis - dex - cha}</h5>
                    <div>
                        <button onClick={randomize}>Randomize</button>
                        <button type="submit" disabled={!canSubmit}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateCharacterPage;