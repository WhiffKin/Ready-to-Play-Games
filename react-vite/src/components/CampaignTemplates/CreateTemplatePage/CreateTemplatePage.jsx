import { useState } from "react";

function CreateTemplatePage() {
    const [skillChecks, setSkillChecks] = useState({});
    const [strength, setStrength] = useState(10);
    const [dexterity, setDexterity] = useState(10);
    const [wisdom, setWisdom] = useState(10);
    const [charisma, setCharisma] = useState(10);

    function setSkillCheckFunc(e, skill, check) {
        e.preventDefault();

        if (!check) return setSkillChecks({ ...skillChecks, [skill]: "Working on it." });

        return setSkillChecks({ ...skillChecks, [skill]: check });
    }

    return (
        <>
        <div>
            <h3>Skill Check:</h3>
            <div>
                { !skillChecks.str ? 
                <button 
                    onClick={e => setSkillCheckFunc(e, "str")}
                >
                    Strength
                </button> :
                (skillChecks.str == "Working on it." ?
                <>
                    <h3>Strength:</h3>
                    <input
                        type="number"
                        value={strength}
                        onChange={e => setStrength(e.target.value)}
                    />
                    <button onClick={e => setSkillCheckFunc(e, "str", strength)} />
                </> :
                <h1
                    onClick={e => setSkillCheckFunc(e, "str")}
                >Strength: {skillChecks.str}</h1>
                )}
                { !skillChecks.wis ? 
                <button 
                    onClick={e => setSkillCheckFunc(e, "wis")}
                >
                    Wisdom
                </button> :
                (skillChecks.wis == "Working on it." ?
                <>
                    <h3>Wisdom:</h3>
                    <input
                        type="number"
                        value={wisdom}
                        onChange={e => setWisdom(e.target.value)}
                    />
                    <button onClick={e => setSkillCheckFunc(e, "wis", wisdom)} />
                </> :
                <h1
                    onClick={e => setSkillCheckFunc(e, "wis")}
                >Wisdom: {skillChecks.wis}</h1>
                )}
                { !skillChecks.dex ? 
                <button 
                    onClick={e => setSkillCheckFunc(e, "dex")}
                >
                    Dexterity
                </button> :
                (skillChecks.dex == "Working on it." ?
                <>
                    <h3>Dexterity:</h3>
                    <input
                        type="number"
                        value={dexterity}
                        onChange={e => setDexterity(e.target.value)}
                    />
                    <button onClick={e => setSkillCheckFunc(e, "dex", dexterity)} />
                </> :
                <h1
                    onClick={e => setSkillCheckFunc(e, "dex")}
                >Dexterity: {skillChecks.dex}</h1>
                )}
                { !skillChecks.cha ? 
                <button 
                    onClick={e => setSkillCheckFunc(e, "cha")}
                >
                    Charisma
                </button> :
                (skillChecks.cha == "Working on it." ?
                <>
                    <h3>Charisma:</h3>
                    <input
                        type="number"
                        value={charisma}
                        onChange={e => setCharisma(e.target.value)}
                    />
                    <button onClick={e => setSkillCheckFunc(e, "cha", charisma)} />
                </> :
                <h1
                    onClick={e => setSkillCheckFunc(e, "cha")}
                >Charisma: {skillChecks.cha}</h1>
                )}
            </div>
        </div>
        </>
    )
}
export default CreateTemplatePage;