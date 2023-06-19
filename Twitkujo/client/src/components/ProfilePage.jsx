import { React, useEffect, useState } from "react";
import axios from "axios";
import "../Css/profilepage.css";
import MessageList from "./MessageList";
// import StatisticsList from './StatisticsList';
import FriendList from "./FriendList";
import AddFriend from "./AddFriend";
import DeleteFriend from "./DeleteFriend";
import Statistics from "./Statistics";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage(props) {
    const {
        profileUser,
        setCurrentPage,
        setProfileUser,
        User,
        setDefaultOptionPage,
        datamess,
        currentPage,
        loading,
        setLoading,
    } = props;
    // States
    const [alreadyafriend, setalreadyafriend] = useState("");
    const [friendlist, setFriendList] = useState([]);
    const [userLoading, setUserLoading] = useState(true);
    
    // Comportement
    // Vérification de la relation entre l'utilisateur et l'utilisateur du profil affiché
    useEffect(() => {
        axios
            .get("/api/Friends/isfriend?", {
                params: { UserId: User.id, ProfileId: profileUser.id },
            })
            .then((res) => {
                setalreadyafriend(res.data.verif);
            })
            .catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileUser.id]);

    // Récupération des informations de l'utilisateur du profil affiché
    useEffect(() => {
        setUserLoading(true);
        axios
            .get("/api/user/getuser", {
                params: { UserId: profileUser.id },
            })
            .then((res) => {
                setTimeout(() => {
                    setProfileUser(res.data);
                    setUserLoading(false);
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Redirection vers les options, directement sur la page d'édition des informations du profil
    const EditProfile = () => {
        setDefaultOptionPage("editprofile");
        setCurrentPage("Options");
    };

    // Constante contenant le bouton "Follow", "Unfollow" ou "Edit profile"
    // selon l'utilisateur et l'utilisateur du profil affiché
    const AddOrDeleteOrEdit =
        User.username === profileUser.username ? (
            <button
                type="button"
                className="button-profile go-to-profile"
                onClick={EditProfile}
            >
                <p>Edit profile</p>
                <FontAwesomeIcon icon={faPalette} />
            </button>
        ) : alreadyafriend ? (
            <div className="button-profile">
                <DeleteFriend
                    User={User}
                    profileUser={profileUser}
                    setalreadyafriend={setalreadyafriend}
                />
            </div>
        ) : (
            <div className="button-profile">
                <AddFriend
                    User={User}
                    profileUser={profileUser}
                    setalreadyafriend={setalreadyafriend}
                />
            </div>
        );

    // Affichage
    return (
        <div>
            <div className="body-profilepage">
                <main className="main-profilepage">
                    <div className="profilepage-banner-container brad">
                        {userLoading ? (
                            <div className="banner-loading banner brad">
                                <span className="loading-circle"></span>
                            </div>
                        ) : (
                            <img
                                className="banner brad"
                                src={profileUser.banner}
                                alt="User s banner"
                            ></img>
                        )}
                    </div>

                    <section className="profilepage-statistics-container">
                        <Avatar
                            src={profileUser.profilpicture}
                            alt="Your profile picture"
                            className="profilepicture-container"
                            sx={{ width: 180, height: 180 }}
                        />

                        <p className="profile-username">
                            {profileUser.username}
                        </p>
                        <div className="statistics-container">
                            <Statistics profileUser={profileUser}></Statistics>
                        </div>
                    </section>

                    <section className="profilepage-messageList-container">
                        <MessageList
                            setCurrentPage={setCurrentPage}
                            User={User}
                            setProfileUser={setProfileUser}
                            profileUser={profileUser}
                            datamess={datamess}
                            currentPage={currentPage}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </section>

                    <section className="profilepage-friendlist">
                        <div className="AddOrDeleteOrEdit">
                            {AddOrDeleteOrEdit}
                        </div>
                        <FriendList
                            setCurrentPage={setCurrentPage}
                            User={User}
                            setProfileUser={setProfileUser}
                            FriendList={friendlist}
                            setFriendList={setFriendList}
                            profileUser={profileUser}
                            currentPage={currentPage}
                        />
                    </section>
                </main>
            </div>
        </div>
    );
}
