import React, { useState } from "react";
import "../Css/options.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBrush,
    faRightFromBracket,
    faUserPen,
    faPersonCircleQuestion
} from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@mui/material";
import darkscreen from "../ressources/CaptureDark.png";
import lightscreen from "../ressources/CaptureLight.png";
import axios from "axios";
import EditProfile from "./EditProfile";

export default function Options(props) {
    const {
        User,
        setUser,
        setLoginStatus,
        ThemeSwitch,
        defaultoptionpage,
        setInfo,
        setInformation,
    } = props;
    // State
    const [settingPage, setSettingPage] = useState(defaultoptionpage);

    // Comportement
    // Constantes permettant de changer la valeur de "settingPage"
    const setThemePage = () => {
        setSettingPage("theme");
    };
    const setEditPage = () => {
        setSettingPage("editprofile");
    };

    // Déconnexion de l'utilisateur 
    const handleLogout = async () => {
        await axios.delete("/api/Form/Logout").then(() => {
            setUser("");
            setLoginStatus(false);
        });
    };

    //Fonction renvoyant la page à afficher selon la navigation de l'utilisateur (setters sur boutons)
    function settingSelector() {
        switch (settingPage) {
            case "none":
                return (
                    <div className="noSettings">
                      Nothing to be done here <FontAwesomeIcon icon={faPersonCircleQuestion}/>
                      <br />
                      <br />
                      Browse the different pages in the menu on your left.
                    </div>
                );

            case "theme":
                return (
                    <section className="Settings">
                        <div className="Settings-title">Theme settings</div>
                        <div className="Settings-descriptor">
                            Here, you can switch between the default dark theme
                            and the light theme.
                        </div>
                        <div className="themeSettings-container">
                            <div className="themeSwitch">
                                <Switch
                                    className="switch"
                                    defaultChecked
                                    size="large"
                                    onClick={ThemeSwitch}
                                />
                            </div>
                            <div className="examples-container">
                                <article className="example">
                                    <div className="example-photo">
                                        <img
                                            className="screenshot"
                                            src={darkscreen}
                                            alt="Default dark theme example"
                                        />
                                    </div>
                                    <span className="example-legend">
                                        Default dark theme
                                    </span>
                                </article>
                                <article className="example">
                                    <div className="example-photo">
                                        <img
                                            className="screenshot"
                                            src={lightscreen}
                                            alt="Light theme example 2"
                                        />
                                    </div>
                                    <span className="example-legend">
                                        Light theme
                                    </span>
                                </article>
                            </div>
                        </div>
                    </section>
                );

            case "editprofile":
                return (
                    // Composant séparé pour éviter un code trop lourd dans le composant "Options"
                    <EditProfile
                        User={User}
                        setUser={setUser}
                        setInfo={setInfo}
                        setInformation={setInformation}
                    />
                );

            default:
        }
    }

    //Affichage
    return (
        <div className="options-container">
            <section className="options-menu-container">
                <span className="options-menu-element">
                    <button
                        type="button"
                        className="options-menu-buttons"
                        onClick={setEditPage}
                    >
                        <FontAwesomeIcon icon={faUserPen} /> Edit your profile
                    </button>
                </span>
                <span className="options-menu-element">
                    <button
                        type="button"
                        className="options-menu-buttons"
                        onClick={setThemePage}
                    >
                        <FontAwesomeIcon icon={faBrush} /> Change theme
                    </button>
                </span>
                <span className="options-menu-element">
                    <button
                        type="button"
                        className="options-menu-buttons"
                        onClick={handleLogout}
                    >
                        <span id="logout">
                            <FontAwesomeIcon icon={faRightFromBracket} /> Log 
                            out
                        </span>
                    </button>
                </span>
            </section>
            <section className="options-settings-container">
                {settingSelector()}
            </section>
        </div>
    );
}
