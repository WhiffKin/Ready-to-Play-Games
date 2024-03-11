import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteCampaign } from "../../../redux/campaign";

function DeleteCampaignModal({ campaignId, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteCampaign = async (e) => {
        e.preventDefault();
        await dispatch(thunkDeleteCampaign(campaignId));
        navigate(`/campaigns`);
        closeModal();
    }

    const keepCampaign = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <>
            <form className="DeleteForm">
                <h1>Confirm Delete</h1>
                <h3>Are you sure you want to delete this Campaign?</h3>
                <button onClick={deleteCampaign}>Yes (Delete Campaign)</button>
                <button onClick={keepCampaign}>No (Keep Campaign)</button>
            </form>
        </>
    )
}

export default DeleteCampaignModal;