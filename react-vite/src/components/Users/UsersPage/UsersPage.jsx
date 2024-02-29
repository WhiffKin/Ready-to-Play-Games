import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserArray, thunkAddUsers } from "../../../redux/user";

const UsersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(selectUserArray());

    useEffect(() => {
        dispatch(thunkAddUsers())
    }, []);

    if (!users.length) return <h1>Loading Users...</h1>
    return (
        <>
            {users.map(user => (
                <div key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                    <img src={user.profile_pic} alt={`${user.username} profile picture.`} />
                    <span>{user.username}</span>
                    <span>{user.email}</span>
                </div>
            ))}
        </>
    );
}

export default UsersPage;