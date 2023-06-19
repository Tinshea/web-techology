import { useState } from "react";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrashCan,
    faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as lightHeart } from "@fortawesome/free-regular-svg-icons";

export default function MessagePreview(props) {
    const {User} = props;
    // States
    const [likePreview, setLikePreview] = useState(false);
    const [likeCounter, setLikeCounter] = useState(0);

    // Date actuelle
    var date = new Date().toLocaleTimeString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    // Affichage d'un message factice pour montrer un aperçu d'un message à l'utilisateur lorsque aucun message n'est récupéré
    return (
        <div>
            <button
                className="article-profile"
            >
                <Avatar
                    src={User.profilpicture}
                    alt="Your profile picture"
                    className="Profil-picture"
                    sx={{ width: 70, height: 70 }}
                />
                <div className="username-time">
                    <div className="article-profile-username">
                        {User.username}
                    </div>
                </div>
            </button>
            <article className="article-List lightborder">
                <button className="trash">
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <p className="p-MessageList">
                    Welcome to Twitkujo !
                </p>
                <div className="message-footer">
                    <time className="time">{date}</time>
                    <span className="time-like">
                        {/* Possibilité de "like" le message  pour avoir un aperçu des icônes */}
                        {likePreview ? (
                            <button
                            type="button"
                                className="footericon"
                                onClick={() => {
                                    setLikePreview(false);
                                    setLikeCounter(0);
                                }}
                            >
                                <FontAwesomeIcon icon={solidHeart} />{" "}
                                {likeCounter}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="footericon"
                                onClick={() => {
                                    setLikePreview(true);
                                    setLikeCounter(1);
                                }}
                            >
                                <FontAwesomeIcon icon={lightHeart} />{" "}
                                {likeCounter}
                            </button>
                        )}
                    </span>
                </div>
            </article>
        </div>
    );
}
