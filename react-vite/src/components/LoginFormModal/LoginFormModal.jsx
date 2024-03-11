import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  async function loginDemo(e) {
    e.preventDefault();

    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );
    closeModal();
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>{errors.email && errors.email} </p>
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p>{errors.password && errors.password} </p>
        </label>
        <button type="submit">Log In</button>
        <div 
          className="cursor-pointer"
          onClick={loginDemo}
        >Click me for a demo user!</div>
      </form>
    </>
  );
}

export default LoginFormModal;
