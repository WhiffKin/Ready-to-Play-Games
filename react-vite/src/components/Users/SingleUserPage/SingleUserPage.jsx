import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIndividualUser, thunkAddUser } from "../../../redux/user";

const SingleUserPage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(selectIndividualUser(userId));

    useEffect(() => {
        dispatch(thunkAddUser(userId));
    }, [])

    console.log(user)
    if (!user) return <h1>Loading user...</h1>
    return (
        <>
            <div>
                <img src={user.profilePic} alt={`${user.username}&apos;s profile picture.`} />
                <div>
                    <h1>{user.username}</h1>
                    <h3>{user.firstName} {user.lastName}</h3>
                </div>
            </div>
            <h3>Description</h3>
            <span>{user.description}</span>
            <h3>{user.username}&apos;s Templates</h3>
            {/* User Campaign Templates */}
            <h3>{user.username}&apos;s Rooms</h3>
            {/* User Rooms */}
            <h3>{user.username}&apos;s Items</h3>
            {/* User Items */}
        </>
    )
}

export default SingleUserPage;