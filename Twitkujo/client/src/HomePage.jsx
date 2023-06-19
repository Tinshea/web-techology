import { useEffect, useState } from "react";
import "./index.css";
import WelcomePage from "./components/WelcomePage";
import MainPage from "./components/MainPage";
import ProfilePage from "./components/ProfilePage";
import Header from "./components/Header";
import Options from "./components/Options";
import "./Css/theme.css";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function HomePage() {
    //States
    const [loginStatus, setLoginStatus] = useState(true);
    const [theme, setCurrentTheme] = useState("default");
    const [defaultoptionpage, setDefaultOptionPage] = useState("none");
    const [User, setUser] = useState();
    const [profileUser, setProfileUser] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [search, setSearch] = useState("");
    const [datamess, setDatamess] = useState([]);
    const [info, setInfo] = useState(false);
    const [information, setInformation] = useState("");
    const [loading, setLoading] = useState(true);

    // Comportement
    // Changement de theme
    function ThemeSwitch() {
        const res = theme === "default" ? "light" : "default";
        axios.put("/api/user/changetheme", { id: User.id, theme: res }).then();
        setCurrentTheme(res);
    }

    // Filtre pour barre de recherche
    const handleSearch = (event) => {
        event.preventDefault();
        axios
            .get("/api/filter/fitremessage", { params: { filter: search } })
            .then((res) => {
                setDatamess(res.data);
            })
            .catch((error) => {
                setInfo(true);
                setInformation("No message found");
            });
        setSearch("");
    };

    // Vérification de la session express, si existante, alors on continue la session
    useEffect(() => {
        const fetchData = async () => {
            axios
                .get("/api/Form/Isconnected")
                .then((res) => {
                    const response = res.data;
                    axios
                        .get("/api/user/getuser", {
                            params: { UserId: response },
                        })
                        .then((res) => {
                            setUser(res.data);
                            setCurrentTheme(res.data.theme);
                            setCurrentPage("MainPage");
                            setLoginStatus(true);
                        })
                        .catch((e) => {
                            setLoginStatus(false);
                        });
                })
                .catch((e) => {
                    setLoginStatus(false);
                });
        };
        fetchData();
    }, []);

    // Changement de theme sur changement de l'état "theme"
    useEffect(() => {
        if (theme === "default") {
            document.documentElement.setAttribute("theme", "default");
        } else {
            document.documentElement.setAttribute("theme", "light");
        }
    }, [theme]);

    //Constante contenant le header entier
    const headerDisp = (
        <div className="header">
            <Header
                setCurrentPage={setCurrentPage}
                User={User}
                setProfileUser={setProfileUser}
                ThemeSwitch={ThemeSwitch}
                theme={theme}
                setDefaultOptionPage={setDefaultOptionPage}
                handleSearch={handleSearch}
                search={search}
                setSearch={setSearch}
            />
            {info ? (
                <Stack spacing={2}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setInfo(false);
                                    setInformation("");
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </IconButton>
                        }
                        severity="info"
                    >
                        {information}
                    </Alert>
                </Stack>
            ) : (
                ""
            )}
        </div>
    );

    //Fonction renvoyant la page à afficher selon la navigation de l'utilisateur (setters sur boutons)
    function pageSelector() {
        if (loginStatus) {
            switch (currentPage) {
                case "MainPage":
                    return (
                        <div className="page">
                            {headerDisp}
                            <div className="main-body">
                                <MainPage
                                    setCurrentPage={setCurrentPage}
                                    User={User}
                                    setProfileUser={setProfileUser}
                                    datamess={datamess}
                                    setDatamess={setDatamess}
                                    currentPage={currentPage}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            </div>
                        </div>
                    );

                case "ProfilePage":
                    return (
                        <div className="page">
                            {headerDisp}
                            <div className="main-body">
                                <ProfilePage
                                    profileUser={profileUser}
                                    setCurrentPage={setCurrentPage}
                                    setProfileUser={setProfileUser}
                                    User={User}
                                    setDefaultOptionPage={setDefaultOptionPage}
                                    datamess={datamess}
                                    currentPage={currentPage}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            </div>
                        </div>
                    );

                case "Options":
                    return (
                        <div className="page">
                            {headerDisp}
                            <div className="main-body">
                                <Options
                                    User={User}
                                    setUser={setUser}
                                    setLoginStatus={setLoginStatus}
                                    ThemeSwitch={ThemeSwitch}
                                    defaultoptionpage={defaultoptionpage}
                                    setInfo={setInfo}
                                    setInformation={setInformation}
                                />
                            </div>
                        </div>
                    );

                default:
                    return null;
            }
        } else {
            return (
                <WelcomePage
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    setLoginStatus={setLoginStatus}
                    setUser={setUser}
                />
            );
        }
    }

    //Affichage
    return pageSelector();
}

export default HomePage;
