import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRoomArray, thunkGetRooms } from "../../../redux/room";
import { useNavigate } from "react-router-dom";
import { thunkPostTemplate } from "../../../redux/campaignTemplate";

function CreateTemplatePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const rooms = useSelector(selectRoomArray());
    
    const [validation, setValidation] = useState({});
    const [canSubmit, setCanSubmit] = useState(true);
    const [showTemplate, setShowTemplate] = useState(false);
    const [name, setName] = useState("");
    const [backgroundSprite, setBackgroundSprite] = useState();
    const [allRooms, setAllRooms] = useState([]);
    const [newRoom, setNewRoom] = useState(false);
    const [skillChecks, setSkillChecks] = useState({});
    const [strength, setStrength] = useState(10);
    const [dexterity, setDexterity] = useState(10);
    const [wisdom, setWisdom] = useState(10);
    const [charisma, setCharisma] = useState(10);

    useEffect(() => {
        dispatch(thunkGetRooms());
    }, [])

    function setSkillCheckFunc(e, skill, check) {
        e.preventDefault();

        if (!check) return setSkillChecks({ ...skillChecks, [skill]: "Working on it." });

        return setSkillChecks({ ...skillChecks, [skill]: check });
    }
    
    function setBackgroundSpriteFunc(e) {
        if (e.target.files && e.target.files[0])
            setBackgroundSprite({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),   
            });
    }

    function startTemplate(e) {
        e.preventDefault();

        const newValid = {};
        if (!name.length) newValid.name = "Name is required.";
        if (!backgroundSprite) newValid.backgroundSprite = "Background Sprite is required.";

        // Unsuccessful validation.
        if (Object.values(newValid).length) return setValidation(newValid);

        setShowTemplate(true);
    }

    function clearRoomForm() {
        setSkillChecks({});
        setStrength(10);
        setDexterity(10);
        setWisdom(10);
        setCharisma(10);
        setNewRoom(false);
        setValidation({});
    }

    function addRoom() {
        // Validations
        const tempValid = {};
        if (typeof newRoom == "boolean") tempValid.room = "A room must be selected.";
        if (!Object.values(skillChecks).length) tempValid.check = "There must be a skill check or an enemy.";
        if (Object.values(skillChecks).find(value => value == "Working on it.")) tempValid.check = "Finish changes before submission.";

        // Unsuccessful Validation
        if (Object.values(tempValid).length) return setValidation(tempValid);

        // Successful Validation
        let room = `${newRoom};`;
        for (let check in skillChecks) 
            room += `${check}:${skillChecks[check]}-`
        // Cut off the last '-'
        room = room.substring(0, room.length - 1);
        setAllRooms([...allRooms, room]);
        clearRoomForm();
    }

    const onSubmit = async e => {
        e.preventDefault();
        setCanSubmit(false);

        const tempValid = {};
        if (!allRooms.length) tempValid.rooms = "A room must be added before submission."
        if (!name.length) tempValid.name = "Name is required.";
        if (!backgroundSprite) tempValid.backgroundSprite = "Background Sprite is required.";

        // Unsuccessful Validation
        if (Object.values(tempValid).length) {
            setValidation(tempValid);
            setCanSubmit(true);
            return;
        }

        const payload = {
            name, 
            background_sprite: backgroundSprite.file,
            rooms: allRooms.join(","),
        }

        const response = await dispatch(thunkPostTemplate(payload));
        
        if (response.errors) { 
            setValidation(response.errors);
            setCanSubmit(true);
            return;
        }
        
        navigate(`/templates/${response.id}`);
    }

    return (
        <form onSubmit={onSubmit}>
            {showTemplate ? 
            <>
                <h1>{name}</h1>
                {allRooms.map((roomData, index) => {
                    const roomId = roomData.split(";")[0];
                    const skillChecks = roomData.split(";")[1].split("-")
                    const room = rooms.find(room => room.id == roomId);
                    return (
                        <div key={index}>
                            <h1>{room.name}</h1>
                            <h3>Skill Check{skillChecks.length > 1 && "s"}:</h3>
                            {skillChecks.map(check => {
                                check = check.split(":");
                                switch(check[0]) {
                                    case "s":
                                        return <span key={check[0]}>Strength: {check[1]}</span>
                                    case "w":
                                        return <span key={check[0]}>Wisdom: {check[1]}</span>
                                    case "c":
                                        return <span key={check[0]}>Charisma: {check[1]}</span>
                                    case "d":
                                        return <span key={check[0]}>Dexterity: {check[1]}</span>
                                }
                            })}
                        </div>
                    )
                })}
                {newRoom ? 
                <>
                    <label>
                        Select a room
                        <select
                            type="select"
                            value={newRoom}
                            onChange={e => setNewRoom(e.target.value)}
                        >
                            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                        </select>
                        <p>{validation.room}</p>
                    </label>
                    <h3>Skill Check:</h3>
                    <p>{validation.check}</p>
                    <div>
                        { !skillChecks.s ? 
                        <button 
                            onClick={e => setSkillCheckFunc(e, "s")}
                        >
                            Strength
                        </button> :
                        (skillChecks.s == "Working on it." ?
                        <>
                            <h3>Strength:</h3>
                            <input
                                type="number"
                                value={strength}
                                onChange={e => setStrength(e.target.value)}
                            />
                            <button onClick={e => setSkillCheckFunc(e, "s", strength)} />
                        </> :
                        <h1
                            onClick={e => setSkillCheckFunc(e, "s")}
                        >Strength: {skillChecks.s}</h1>
                        )}
                        { !skillChecks.w ? 
                        <button 
                            onClick={e => setSkillCheckFunc(e, "w")}
                        >
                            Wisdom
                        </button> :
                        (skillChecks.w == "Working on it." ?
                        <>
                            <h3>Wisdom:</h3>
                            <input
                                type="number"
                                value={wisdom}
                                onChange={e => setWisdom(e.target.value)}
                            />
                            <button onClick={e => setSkillCheckFunc(e, "w", wisdom)} />
                        </> :
                        <h1
                            onClick={e => setSkillCheckFunc(e, "w")}
                        >Wisdom: {skillChecks.w}</h1>
                        )}
                        { !skillChecks.d ? 
                        <button 
                            onClick={e => setSkillCheckFunc(e, "d")}
                        >
                            Dexterity
                        </button> :
                        (skillChecks.d == "Working on it." ?
                        <>
                            <h3>Dexterity:</h3>
                            <input
                                type="number"
                                value={dexterity}
                                onChange={e => setDexterity(e.target.value)}
                            />
                            <button onClick={e => setSkillCheckFunc(e, "d", dexterity)} />
                        </> :
                        <h1
                            onClick={e => setSkillCheckFunc(e, "d")}
                        >Dexterity: {skillChecks.d}</h1>
                        )}
                        { !skillChecks.c ? 
                        <button 
                            onClick={e => setSkillCheckFunc(e, "c")}
                        >
                            Charisma
                        </button> :
                        (skillChecks.c == "Working on it." ?
                        <>
                            <h3>Charisma:</h3>
                            <input
                                type="number"
                                value={charisma}
                                onChange={e => setCharisma(e.target.value)}
                            />
                            <button onClick={e => setSkillCheckFunc(e, "c", charisma)} />
                        </> :
                        <h1
                            onClick={e => setSkillCheckFunc(e, "c")}
                        >Charisma: {skillChecks.c}</h1>
                        )}
                    </div>
                    <button
                        onClick={addRoom}
                    >Add room.</button>
                    <button
                        onClick={clearRoomForm}
                    >Cancel.</button>
                </>:
                <>
                    <div onClick={() => setNewRoom(rooms[0].id)}>
                        Add a room?
                    </div>
                    {!!allRooms.length  && 
                        <button
                            disabled={!canSubmit}
                        >Create Template</button>}
                </>} 
            </> :
                <>
                    <div>
                        <label>
                            Name
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <p>{validation.name && validation.name}</p>
                        </label>
                        <label>
                            Choose a background for this template.
                            <input
                                type="file"
                                accept="image/*"
                                onChange={setBackgroundSpriteFunc}
                            />
                            <p>{validation.backgroundSprite && validation.backgroundSprite}</p>
                        </label> 
                    </div>
                    <button 
                        onClick={startTemplate}
                    >
                        {"->"}
                    </button>
                </>
            }
        </form>
    )
}
export default CreateTemplatePage;