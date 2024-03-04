import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteCharacter } from "../../../redux/character";

function DeleteCharModal({ charId, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteChar = async (e) => {
        e.preventDefault();
        await dispatch(thunkDeleteCharacter(charId));
        navigate(`/`);
        closeModal();
    }

    const keepChar = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <>
            <form className="DeleteForm">
                <h1>Confirm Delete</h1>
                <h3>Are you sure you want to delete this Character?</h3>
                <button onClick={deleteChar}>Yes (Delete Character)</button>
                <button onClick={keepChar}>No (Keep Character)</button>
            </form>
        </>
    )
}

export default DeleteCharModal;