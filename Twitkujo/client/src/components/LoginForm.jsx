import { useState } from "react";
import axios from "axios";
import "../Css/Form.css";

export default function LoginForm(props) {
    const { setCurrentPage, setLoginStatus, setUser } = props;
    // States
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Comportement
    // Envoi des informations de connexion à l'api pour se connecter
    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("/api/Form/login", {
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
    };

    const handlechangeusername = (event) => {
        setusername(event.target.value);
        setErrorMessage(""); // On efface le message d'erreur s'il y en a un
    };

    const handlechangepassword = (event) => {
        setpassword(event.target.value);
        setErrorMessage(""); // On efface le message d'erreur s'il y en a un
    };

    // Changement de la page à afficher (redirection à la page de création de compte)
    const handleregisterFormClick = (event) => {
        event.preventDefault();
        setCurrentPage("register");
    };

    // Affichage
    return (
        <div className="bodyform">
            <div className="center">
                <header>
                    <h1 className="h1form">Login</h1>
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
                                value={username}
                                type="text"
                                id="login"
                                onChange={handlechangeusername}
                                required
                            />
                            <span></span>
                            <label htmlFor="login">Login</label>
                        </div>
                        <div className="item">
                            <input
                                className="inputform"
                                value={password}
                                type="password"
                                id="Password"
                                onChange={handlechangepassword}
                                required
                            />
                            <span></span>
                            <label htmlFor="Password">Password</label>
                        </div>
                        <p className="error-message-login">{errorMessage}</p>
                        <input
                            className="inputform"
                            type="submit"
                            value="Login"
                        />
                        <div className="signup">
                            Not a member?{" "}
                            <button onClick={handleregisterFormClick}>
                                {" "}
                                Sign up{" "}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
