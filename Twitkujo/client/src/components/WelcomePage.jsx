import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../Css/welcomepage.css";

export default function WelcomePage(props) {
    const { setCurrentPage, currentPage, setLoginStatus, setUser } = props;

    //Comportement
    // Redirection vers la page de connexion
    const handleLoginForm = () => {
        setCurrentPage("login");
    };
    // Redirection vers la page d'inscription
    const handleRegisterForm = () => {
        setCurrentPage("register");
    };

    // Conditions d'affichage
    if (currentPage === "login") {
        return (
            <LoginForm
                setCurrentPage={setCurrentPage}
                setLoginStatus={setLoginStatus}
                setUser={setUser}
            />
        );
    }
    if (currentPage === "register") {
        return (
            <RegisterForm
                setCurrentPage={setCurrentPage}
                setLoginStatus={setLoginStatus}
                setUser={setUser}
            />
        );
    }

    //Affichage
    return (
        <div className="welcome-page">
            <h1 className="welcomepage-header">Welcome to Twitkujo</h1>
            <div className="welcomepage-buttons">
                <button
                    className="welcomepage-button"
                    onClick={handleLoginForm}
                >
                    Login
                </button>
                <button
                    className="welcomepage-button"
                    onClick={handleRegisterForm}
                >
                    Register
                </button>
            </div>
        </div>
    );
}
