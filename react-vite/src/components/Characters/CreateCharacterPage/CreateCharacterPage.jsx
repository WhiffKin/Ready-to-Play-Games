import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { chooseRandElem } from "../../../helperFuncs";
import names from "./names";
import { thunkPostCharacter, thunkUpdateCharacter } from "../../../redux/character";
import SignupFormModal from "../../SignupFormModal";
import { useModal } from "../../../context/Modal";
import "./CreateCharacterPage.css";

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
    const [clearStatValid, setClearStatValid] = useState();
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
        if (!user) navigate("/");
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

    const resetValidation = () => {
        setValidation({...validation, stats: null});
    }

    // Increment stats iff the total is within 40 (base level stat points)
    const incrementStats = (e, type) => {
        const val = e.target.value;
        if (val < 0) return;
        
        const max = 40 + (editedChar ? Math.floor(Math.sqrt(editedChar.experience / 2)) : 0)
        let total = str + dex + wis + cha;
        switch(type) {
            case "str":
                total += val - str;
                if (total <= max) setStr(val ? parseInt(val) : 0);
                break;
            case "dex":
                total += val - dex;
                if (total <= max) setDex(val ? parseInt(val) : 0);
                break;
            case "wis":
                total += val - wis;
                if (total <= max) setWis(val ? parseInt(val) : 0);
                break;
            case "cha":
                total += val - cha;
                if (total <= max) setCha(val ? parseInt(val) : 0);
                break;
        }

        if (total <= max) return resetValidation();

        if (clearStatValid) clearTimeout(clearStatValid);
        setClearStatValid(setTimeout(resetValidation, 2000));
        return setValidation({...validation, stats: "Stats are maxxed out."});
    }

    const randomizeStats = () => {
        const newStats = [0,0,0,0];
        const max = 40 + (editedChar ? Math.floor(Math.sqrt(editedChar.experience / 2)) : 0)
        for (let i = 0; i < max; i++)
            newStats[Math.floor(Math.random() * 4)]++;

        setStr(newStats[0]);
        setDex(newStats[1]);
        setWis(newStats[2]);
        setCha(newStats[3]);
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

        randomizeStats();
    }

    // Form submission
    const onSubmit = async e => {
        e.preventDefault();
        setCanSubmit(false);

        // Validations
        const newValid = {};
        if (name.length < 2) newValid.name = "Name must have a minimum length of 2.";
        if (name.length > 40) newValid.name = "Name must have a maximum length of 40.";
        const max = 40 + (editedChar ? Math.floor(Math.sqrt(editedChar.experience / 2)) : 0)
        if (str + dex + wis + cha < max) newValid.stats = "There are still remaining stat points.";

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
            <div className="create_character-container"> 
                <label className="create_character-image">
                    <img src={sprite} alt="Character sprite preview" className="cursor-pointer"/>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                    />
                </label>
                <form 
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                    className="create_character-form"
                >
                    <h3>Character Details:</h3>
                    <label>
                        <span>Name</span>
                        <input
                            placeholder=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                        ></input>
                        <button onClick={setRandName}>Random</button>
                        <p>{validation.name && validation.name}</p>
                    </label>
                    <label>
                        <span>Alignment</span>
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
                        <span>Class</span>
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
                    <label id="create_character-form-description">
                        <span>Description</span>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></textarea>
                    </label>
                    <h3>Character Stats:</h3>
                    <div className="create_character-form-stats">
                        <label>
                            Strength
                            <input
                                type="number"
                                value={str}
                                onChange={e => incrementStats(e, "str")}
                                onKeyDown={"return false"}
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
                    </div>
                    <label id="create_character-stats-remaining">
                        <p>{validation.stats && validation.stats}</p>
                        <h5>Stat points left: {40 + (editedChar ? Math.floor(Math.sqrt(editedChar.experience / 2)) : 0) - str - wis - dex - cha}</h5>
                    </label>
                    <div id="create_character-button_container" >
                        <button onClick={randomize}>Randomize</button>
                        <button type="submit" disabled={!canSubmit}>Submit</button>
                        {editedChar && 
                        <button onClick={e => {
                            e.preventDefault();
                            navigate(`/characters/${editedChar.id}`)
                        }}>Cancel</button>}
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateCharacterPage;