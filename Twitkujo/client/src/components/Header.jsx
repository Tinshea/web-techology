import { React } from "react";
import "../Css/header.css";
import logoD from "../ressources/twitkujologodark.gif";
import logoL from "../ressources/twitkujologowhite.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Switch, Avatar } from "@mui/material";

export default function Header(props) {
    const { setCurrentPage, User, setProfileUser,ThemeSwitch, theme, setDefaultOptionPage, handleSearch, search, setSearch} = props;
    
    // Comportement
    // Mise à jour des états permettant l'affichage du profil de l'utilisateur
    const handleloadmainprofil = (User) => {
        setProfileUser(User);
        setDefaultOptionPage("none")
        setCurrentPage("ProfilePage");
    };

    const handleChange = (event) => {
        setSearch(event.target.value);
      };
    
      // Mise à jour de l'état "currentPage" pour afficher la page des options
    const handleoptions = () => {
        setCurrentPage("Options");
    };
    
    // Mise à jour des états permettant l'affichage de la page principale
    const handleloadmainpage = () => {
        setProfileUser("");
        setDefaultOptionPage("none");
        setCurrentPage("MainPage");
    };

    // Mise à jour du logo à afficher selon le thème sélectionné par l'utilisateur
    function logo() {
        return theme === "default" ? (
            <img src={logoD} alt="icone du site" className="logo-mainpage" />
        ) : (
            <img src={logoL} alt="icone du site" className="logo-mainpage" />
        );
    }

    // Affichage
    return (
        <header id="header-mainpage">
            <div id="logo-searchbar">
                <button
                    type="button"
                    className="logo-container"
                    onClick={() => handleloadmainpage()}
                >
                    {logo()}
                </button>
                <form id="searchbar-mainpage" onSubmit={handleSearch}>
                    <input
                        type="search"
                        className="searchbar2-mainpage"
                        id="site-search"
                        name="site-search"
                        placeholder="Rechercher"
                        onChange={handleChange}
                        value={search}
                    />
                </form>
            </div>

            <div className="switch-div">
                <span className="switch-icons"><FontAwesomeIcon icon={faLightbulb}/></span>
                <Switch defaultChecked onClick={ThemeSwitch}/>
            </div>
            <nav>
                <ul id="links-mainpage">
                    <li>
                        <button
                            type="button"
                            className="a-mainpage"
                            onClick={() => handleloadmainprofil(User)}
                        >
                            <FontAwesomeIcon icon={faUser} size="lg" />
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="a-mainpage"
                            onClick={() => handleoptions()}
                        >
                            <FontAwesomeIcon icon={faGear} size="lg" />
                        </button>
                    </li>
                </ul>
            </nav>
            
            <button
                type="button" 
                className="UserButtoncontainer"
                onClick={() => handleloadmainprofil(User)}
            >
                <div className="headerprofilepicture-container">
                    <Avatar
                        src={User.profilpicture}
                        alt="Your profile picture"
                        className="headerprofilepicture-mainpage"
                        sx={{ width: 36, height: 36 }}
                    />
                </div>
                <div id="username-profilepic">
                    <div id="online-username">
                        <p> {User.username}</p>
                    </div>
                </div>
            </button>
        </header>
    );
}
