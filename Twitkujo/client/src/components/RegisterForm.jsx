import { useState } from "react";
import "../Css/Form.css";
import axios from "axios";

export default function RegisterForm(props) {
    const { setCurrentPage, setLoginStatus, setUser } = props;  
    //States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    

    //Comportement
	// Création d'un compte si les informations répondent aux éxigences 
    const handleSubmit = (event) => {
        event.preventDefault();

        if (password === confirmPassword) {
            axios
                .post("/api/Form/register", {
                    username: username,
                    password: password,
                })
                .then((res) => {
                    const response = res.data;
                    setUser(response.User);
                    setCurrentPage("MainPage");
                    setLoginStatus(true);
                })
                .catch((error) => {
                    const response = error.response.data;
                    setErrorMessage(response.message);
                });
        } else {
            setErrorMessage("Password confirmation doesn't match.");
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

	// Redirection vers la page de connexion
    const handleLoginFormClick = (event) => {
        event.preventDefault();
        setCurrentPage("login");
    };

    //Affichage
    return (
        <div className="bodyform">
            <div className="center">
                <header>
                    <h1 className="h1form">Register</h1>
                </header>
                <main>
                    <form
                        action="submit"
                        className="conteneur"
                        onSubmit={handleSubmit}
                    >
                        <div className="item">
                            <input
                                className="inputform"
                                type="text"
                                id="user"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            <span></span>
                            <label htmlFor="user">Username</label>
                        </div>
                        <div className="item">
                            <input
                                className="inputform"
                                type="password"
                                id="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <span></span>
                            <label htmlFor="Password">Password</label>
                        </div>
                        <div className="item">
                            <input
                                className="inputform"
                                type="password"
                                id="ConfirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            <span></span>
                            <label htmlFor="ConfirmPassword">
                                Confirm Password
                            </label>
                        </div>
                        <input
                            className="inputform"
                            type="submit"
                            value="Register"
                        />
                        <p className="error-message-login">{errorMessage}</p>
                        <div className="signup">
                            Already a user?{" "}
                            <button onClick={handleLoginFormClick}>
                                Log in
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
