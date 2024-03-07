import { useDispatch, useSelector } from "react-redux";
import CreateCharacterPage from "../CreateCharacterPage/CreateCharacterPage";
import { useParams } from "react-router-dom";
import { selectIndividualChar, thunkGetCharacterById } from "../../../redux/character";
import { useEffect } from "react";

function UpdateCharacterPage () {
    const { charId } = useParams();
    const dispatch = useDispatch();
    const char = useSelector(selectIndividualChar(charId));

    useEffect(() => {
        dispatch(thunkGetCharacterById(charId));
    }, [])

    if (!char) return <h1>Loading Details...</h1>
    return (
        <>
            <CreateCharacterPage editedChar={char} />
        </>
    )
}

export default UpdateCharacterPage;