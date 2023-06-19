import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/message.css";
import "../Css/style.css";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrashCan,
    faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as lightHeart } from "@fortawesome/free-regular-svg-icons";

export default function Message(props) {
    const {
        setCurrentPage,
        User,
        setProfileUser,
        messageinfo,
        onMessageDelete,
    } = props;

    // States
    const [isliked, setIsLiked] = useState(false);
    const [nblikes, setNbLikes] = useState(messageinfo.LikesCount);

    useEffect(() => 
    {
        if (messageinfo !== undefined) 
        {
            setNbLikes(messageinfo.LikesCount);
        }
    }, [messageinfo, messageinfo.LikesCount])

    // Comportement
    // Vérification et affichage du status "like" sur chaque message et mise à jour de l'icône en fonction
    useEffect(() => {
        axios
            .get("/api/Message/isLiked?", {
                params: { UserID: User.id, messageID: messageinfo.messageID },
            })
            .then((res) => {
                setIsLiked(res.data.verif);
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Redirection vers la page de profil de l'auteur du message
    const handleloadprofil = () => {
        setProfileUser({
            id: messageinfo.userId,
        });
        setCurrentPage("ProfilePage");
    };

    // Affichage
    return (
        <li>
            <button
                className="article-profile"
                onClick={() => handleloadprofil()}
            >
                <Avatar
                    src={messageinfo.profilpicture}
                    alt="Your profile picture"
                    className="Profil-picture"
                    sx={{ width: 70, height: 70 }}
                />
                <div className="username-time">
                    <div className="article-profile-username">
                        {messageinfo.username}
                    </div>
                </div>
            </button>
            {/*Affichage du message avec le bouton de suppression uniquement si l'utilisateur connecté est l'auteur du message */}
            <article className="article-List lightborder">
                {User.id === messageinfo.userId ? (
                    <button
                        className="trash"
                        onClick={() =>
                            onMessageDelete(
                                messageinfo.messageID,
                                messageinfo.userId
                            )
                        }
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                ) : null}
                <p className="p-MessageList">{messageinfo.content}</p>

                <div className="message-footer">
                    <time className="time">{messageinfo.time}</time>
                    <span className="time-like">
                        {isliked ? (
                            // Si le message est "liked", possibilité de le retirer en appuyant sur l'icône
                            <button
                                className="footericon"
                                onClick={() => {
                                    axios.delete("/api/Message/deletelike", {
                                        data: {
                                            UserID: User.id,
                                            messageID: messageinfo.messageID,
                                        },
                                    });
                                    setIsLiked(false);
                                    setNbLikes(nblikes - 1);
                                }}
                            >
                                <FontAwesomeIcon icon={solidHeart} /> {nblikes}
                            </button>
                        ) : (
                            // Sinon on peut "like" en appuyant sur l'icône
                            <button
                                className="footericon"
                                onClick={() => {
                                    axios.put("/api/Message/addlike", {
                                        UserID: User.id,
                                        messageID: messageinfo.messageID,
                                    });
                                    setIsLiked(true);
                                    setNbLikes(nblikes + 1);
                                }}
                            >
                                <FontAwesomeIcon icon={lightHeart} /> {nblikes}
                            </button>
                        )}
                    </span>
                </div>
            </article>
        </li>
    );
}
