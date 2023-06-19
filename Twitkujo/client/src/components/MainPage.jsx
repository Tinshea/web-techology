import React, { useState, useEffect } from "react";
import "../Css/mainpage.css";
import MessageList from "./MessageList";
import FriendList from "./FriendList";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserGroup,
    faHeart,
    faFire,
} from "@fortawesome/free-solid-svg-icons";

export default function MainPage(props) {
    const {
        setCurrentPage,
        User,
        setProfileUser,
        currentPage,
        datamess,
        setDatamess,
        loading,
        setLoading,
    } = props;
    // States
    const [friendlist, setFriendList] = useState([]);
    const [Userfriends, setUserFriends] = useState([]);
    // States associés au filtres
    const [activeFilter, setActiveFilter] = useState("");
    const [mostlikesfilter, setMostLikesFilter] = useState(false);
    const [timefilter, setTimeFilter] = useState(false);
    const [mylikesfilter, setMyLikesFilter] = useState(false);
    const [clickStatus, setClickStatus] = useState(false);

    //Comportement
    useEffect(() => {
        axios
            .get("/api/Friends/refreshlistfriends", {
                params: { UserId: User.id },
            })
            .then((res) => {
                setUserFriends(res.data);
            });
    }, [User.id]);

    // Fonction renvoyant la liste des messages ordonnée
    // par le nombre de "likes" sur chaque message
    // seulement si l'état associé au filtre est mis à "true"
    function mostlikes() {
        // console.log("mostlikes", mostlikesfilter, activeFilter);
        if (mostlikesfilter) {
            setLoading(true);
            axios
                .get("/api/filter/mostLikes")
                .then((res) => {
                    setTimeout(() => {
                        // console.log("set mostlikes");
                        setDatamess(res.data);
                        setLoading(false);
                    }, 1000);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else if (!mostlikesfilter && activeFilter === "mostlikes") {
            // console.log("reset mostlikes");
            setActiveFilter("");
            reset();
        }
    }

    // Fonction renvoyant les messages "liked" par l'utilisateur
    // seulement si l'état associé au filtre est mis à "true"
    function mylikes() {
        // console.log("mylikes", mylikesfilter, activeFilter);
        if (mylikesfilter) {
            setLoading(true);
            axios
                .get("/api/filter/myLikes", { params: { UserID: User.id } })
                .then((res) => {
                    setDatamess(res.data);
                    // setTimeout(() => {
                        // console.log("set mylikes");
                        
                        setLoading(false);
                    // }, 1000);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else if (!mylikesfilter && activeFilter === "mylikes") {
            // console.log("reset mylikes");
            setActiveFilter("");
            reset();
        }
    }

    // Fonction renvoyant les messages envoyés par l'utilisateur lui-même
    // et par les autres utilisateurs dans sa liste de follow
    // seulement si l'état associé au filtre est mis à "true"
    function handlefriendsonly() {
        // console.log("friendsonly", clickStatus, activeFilter);
        if (clickStatus) {
            var FriendsList = [];
            if (Userfriends.length > 0) {
                FriendsList = Userfriends.map((objet) =>
                    parseInt(objet.friendID)
                );
            }
            FriendsList.push(parseInt(User.id));
            setLoading(true);
            axios
                .get("/api/filter/FilterByUserId", {
                    params: { filterUserId: FriendsList },
                })
                .then((res) => {
                    setTimeout(() => {
                        setDatamess(res.data);
                        // console.log("set followedonly");
                        setLoading(false);
                    }, 1000);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false); // Ajout de setLoading(false) en cas d'erreur
                });
        } else if (!clickStatus && activeFilter === "followedonly") {
            // console.log("reset followsonly");
            setActiveFilter("");
            reset();
        }
    }

    function reset() {
        setLoading(true);
        axios
            .get("/api/Message/refreshlistMessage")
            .then((res) => {
                setTimeout(() => {
                    setDatamess(res.data);
                    setLoading(false);
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        mostlikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mostlikesfilter]);

    useEffect(() => {
        mylikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mylikesfilter]);

    // Exécution des fonctions associé à l'activation de chaque filtre (état en dépendance)
    useEffect(() => {
        handlefriendsonly();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickStatus]);

    // Mise à jour du filtre actif et de tous les états associés aux filtres
    const handleFilterChange = async (filterName) => {
        // console.log("handlefilterchange", activeFilter, filterName);
        setActiveFilter(filterName);

        switch (filterName) {
            case "oldest":
                setTimeFilter((prevFilter) => !prevFilter);
                if (clickStatus) setClickStatus(false);
                if (mylikesfilter) setMyLikesFilter(false);
                if (mostlikesfilter) setMostLikesFilter(false);
                break;
            case "followedonly":
                setClickStatus((prevFilter) => !prevFilter);
                if (timefilter) setTimeFilter(false);
                if (mylikesfilter) setMyLikesFilter(false);
                if (mostlikesfilter) setMostLikesFilter(false);
                break;
            case "mylikes":
                setMyLikesFilter((prevFilter) => !prevFilter);
                if (timefilter) setTimeFilter(false);
                if (clickStatus) setClickStatus(false);
                if (mostlikesfilter) setMostLikesFilter(false);
                break;
            case "mostlikes":
                setMostLikesFilter((prevFilter) => !prevFilter);
                if (timefilter) setTimeFilter(false);
                if (clickStatus) setClickStatus(false);
                if (mylikesfilter) setMyLikesFilter(false);
                break;
            default:
        }
    };

    //Affichage
    return (
        <div className="body-mainpage">
            <div className="container-mainpage">
                <aside className="filters-mainpage">
                    <h2>Message filter</h2>
                    <div className="filters">
                        <button
                            type="button"
                            className={`filter-buttons ${
                                activeFilter === "mostlikes" ? "active" : ""
                            }`}
                            onClick={() => handleFilterChange("mostlikes")}
                        >
                            <FontAwesomeIcon icon={faFire} /> Most liked
                        </button>
                        <input
                            id="mostliked"
                            type="checkbox"
                            checked={activeFilter === "mostliked"}
                            onChange={() => handleFilterChange("mostlikes")}
                        />

                        <button
                            type="button"
                            className={`filter-buttons ${
                                activeFilter === "mylikes" ? "active" : ""
                            }`}
                            onClick={() => handleFilterChange("mylikes")}
                        >
                            <FontAwesomeIcon icon={faHeart} /> My likes
                        </button>
                        <input
                            id="mylikes"
                            type="checkbox"
                            checked={activeFilter === "mylikes"}
                            onChange={() => handleFilterChange("mylikes")}
                        />

                        <button
                            type="button"
                            className={`filter-buttons ${
                                activeFilter === "oldest" ? "active" : ""
                            }`}
                            onClick={() => handleFilterChange("oldest")}
                        >
                            <FontAwesomeIcon icon={faUserGroup} /> Oldest first
                        </button>
                        <input
                            id="oldest"
                            type="checkbox"
                            checked={activeFilter === "oldest"}
                            onChange={() => handleFilterChange("oldest")}
                        />

                        <button
                            type="button"
                            className={`filter-buttons ${
                                activeFilter === "followedonly" ? "active" : ""
                            }`}
                            onClick={() => handleFilterChange("followedonly")}
                        >
                            <FontAwesomeIcon icon={faUserGroup} /> Followed only
                        </button>
                        <input
                            id="followedonly"
                            type="checkbox"
                            checked={activeFilter === "followedonly"}
                            onChange={() => handleFilterChange("followedonly")}
                        />
                    </div>
                    {loading ? (
                        <div className="filters-loading">
                            <span className="loading-circle"></span>
                        </div>
                    ) : null}
                </aside>

                <main className="main-mainpage">
                    <span id="addmsg"></span>
                    <div>
                        <MessageList
                            setCurrentPage={setCurrentPage}
                            User={User}
                            setProfileUser={setProfileUser}
                            profileUser={""}
                            datamess={datamess}
                            currentPage={currentPage}
                            timefilter={timefilter}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </div>
                </main>
            </div>

            <div className="friendlist-mainpage">
                <FriendList
                    setCurrentPage={setCurrentPage}
                    User={User}
                    setProfileUser={setProfileUser}
                    FriendList={friendlist}
                    setFriendList={setFriendList}
                    profileUser={User}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}
