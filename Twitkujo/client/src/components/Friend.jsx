import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/friend.css";
import "../Css/style.css";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";

export default function Friend(props) {
    const {
        setCurrentPage,
        friend,
        setProfileUser,
        currentPage,
        User,
        setClickStatus,
        profileUser,
        setFriendList,
        FriendList,
        setFriendlistLoading,
    } = props;

    // State
    const [userfriend, setUserFriend] = useState({});

    // Comportement
    // Affichage de la photo de profile d'un utilisateur dans la liste de follow
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/user/getuser", {
                    params: { UserId: friend.friendID },
                });
                setUserFriend(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [friend.friendID]);

    // Suppression d'un follow directement depuis la liste de follow
    const handleDelFriendFromFL = (id) => {
        setClickStatus((prevClickStatus) => !prevClickStatus);
        setFriendlistLoading(true);
        axios
            .delete("/api/Friends/deletefriend", {
                data: { UserID: User.id, friendID: id },
            })
            .then(() => {
                setTimeout(() => {
                    const friendListCopy = [...FriendList];
                    const friendListCopyUpdated = friendListCopy.filter(
                        (friend) => friend.friendID !== id
                    );
                    setFriendList(friendListCopyUpdated);
                    setFriendlistLoading(false);
                    console.log("You unfollowed someone !");
                }, 2000);
            });
    };

    // Mise à jour des états pour l'affichage d'un profil
    const handleLoadProfile = () => {
        setProfileUser(userfriend);
        setCurrentPage("ProfilePage");
    };

    // Affichage
    return (
        <li>
            <article className="article-friend">
                <button className="friend-info" onClick={handleLoadProfile}>
                    <Avatar
                        src={userfriend.profilpicture}
                        className="profilepic-border"
                        alt="Your profile picture"
                        sx={{ width: 40, height: 40 }}
                    />
                    {userfriend.username}
                </button>
                {currentPage === "MainPage" || User.id === profileUser.id ? (
                    // on affiche le bouton de suppression d'ami si nous sommes sur la page principale
                    // ou si nous sommes sur notre propre profil
                    <button
                        className="DeleteFriend"
                        onClick={() => handleDelFriendFromFL(userfriend.id)}
                    >
                        <FontAwesomeIcon
                            className="DF-icon"
                            icon={faUserMinus}
                            size="lg"
                        />
                    </button>
                ) : null}
            </article>
        </li>
    );
}
