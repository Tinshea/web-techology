import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward } from "@fortawesome/free-solid-svg-icons";
import A from "../ressources/Rank/A.png";
import B from "../ressources/Rank/B.png";
import C from "../ressources/Rank/C.png";
import D from "../ressources/Rank/D.png";
import S from "../ressources/Rank/S.png";
import SS from "../ressources/Rank/SS.png";
import SSS from "../ressources/Rank/SSS.png";

import "../Css/statistics.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Statistics(props) {
    const { profileUser } = props;

    // States
    const [average, setAverage] = useState(0);
    const [nbmesssage, setNbmesssage] = useState(0);
    const [maxlike, setMaxlike] = useState(0);
    const [rank, setRank] = useState("");
    const [nbfollowers, setNbFollowers] = useState(0);
    const [loading, setLoading] = useState(true);

    // Comportement
    // Rafraîchissement des statistiques de l'utilisateur du profil affiché
    useEffect(() => {
        setLoading(true);
        axios
            .get("/api/stats/GetuserStat", {
                params: { userID: profileUser.id },
            })
            .then((res) => {
                const data = res.data;
                setAverage(data.average.toFixed(2));
                setNbmesssage(data.nbmessage);
                setMaxlike(data.maxlike);
                setRank(data.rank);
                setNbFollowers(profileUser.nbfollowers);
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            });
    }, [profileUser.id]);

    // Fonction associant l'image d'un rang à son rang
    let rankImage;
    switch (rank) {
        case "A":
            rankImage = A;
            break;
        case "B":
            rankImage = B;
            break;
        case "C":
            rankImage = C;
            break;
        case "D":
            rankImage = D;
            break;
        case "S":
            rankImage = S;
            break;
        case "SS":
            rankImage = SS;
            break;
        case "SSS":
            rankImage = SSS;
            break;
        default:
            rankImage = null;
    }

    // Affichage
    return loading ? (
        <div className="stats-container">         
            <div className="stats-loading">
                <span className="loading-circle"></span>
            </div>
        </div>
    ) : (
        <div className="stats-container">
            <h1>
                Statistics <FontAwesomeIcon icon={faAward} size="lg" />
            </h1>
            <article className="stats-box">
                <span className="stats-info">Number of followers</span>
                <span className="stats-value">{nbfollowers}</span>
            </article>
            <article className="stats-box">
                <span className="stats-info">Most likes on a message</span>
                <span className="stats-value">{maxlike}</span>
            </article>
            <article className="stats-box">
                <span className="stats-info">Avg likes on messages</span>
                <span className="stats-value">{average}</span>
            </article>
            <article className="stats-box">
                <span className="stats-info">Number of messages sent</span>
                <span className="stats-value">{nbmesssage}</span>
            </article>
            <article className="stats-box">
                <span className="stats-info">
                    <img src={rankImage} alt="Rank" className="rank" />
                </span>
            </article>
        </div>
    );
}
