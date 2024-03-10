import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignupFormModal from "../../SignupFormModal";
import { useModal } from "../../../context/Modal";
import { thunkPostCampaign, thunkUpdateCampaign } from "../../../redux/campaign";
import "./CreateCampaignPage.css";

function CreateCharacterPage({ editedCampaign, template }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setModalContent } = useModal();
    const user = useSelector(state => state.session.user);

    const [custSprite, setCustSprite] = useState();
    const [sprite, setSprite] = useState(editedCampaign ? editedCampaign.sprite : "");    
    const [name, setName] = useState(editedCampaign ? editedCampaign.name : "");
    const [description, setDescription] = useState(editedCampaign ? editedCampaign.description : "");
    
    const [validation, setValidation] = useState({});
    const [canSubmit, setCanSubmit] = useState(true);

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

    // Form submission
    const onSubmit = async e => {
        e.preventDefault();
        setCanSubmit(false);

        // Validations
        const newValid = {};
        if (name.length < 2) newValid.name = "Name must have a minimum length of 2."
        if (description.length < 10) newValid.description = "Description must be at least ten characters."

        // Unsuccessful validation
        if (Object.values(newValid).length) {
            setCanSubmit(true);
            return setValidation(newValid);
        }

        const payload = {
            name: `${user.username},${name}`,
            description,
            background_sprite: sprite,
        } 
        if (custSprite && custSprite !== true) payload.background_sprite = custSprite;
        if (editedCampaign) payload.id = editedCampaign.id;
        else payload.map = template.map;

        // Submission
        const response = await dispatch(editedCampaign ? thunkUpdateCampaign(payload) : thunkPostCampaign(payload))

        // Unsuccessful Submission
        if (response.errors) { 
            setValidation(response.errors);
            setCanSubmit(true);
            return;
        }

        // Successful Submission
        navigate(`/campaigns`);
    }

    return (
        <>
            <div> 
                <form 
                    className="create_campaign-container"
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                >
                    <label className="create_campaign-image cursor-pointer">
                        <img 
                            src={sprite}
                            alt="Campaign preview image"
                        />
                        <input
                            id="create_campaign-hidden_input"
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                        />
                    </label>
                    <label>
                        <span>Name</span>
                        <input
                            placeholder=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                        ></input>
                        <p>{validation.name && validation.name}</p>
                    </label>
                    <label>
                        <span>Description</span>
                        <input
                            placeholder=""
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></input>
                        <p>{validation.description && validation.description}</p>
                    </label>
                    <button
                        disabled={!canSubmit}
                    >{editedCampaign ? "Update" : "Create"} Campaign</button>
                </form>
            </div>
        </>
    );
}

export default CreateCharacterPage;