import axios from "axios";
import "../Css/friend.css";
import "../Css/profilepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";

export default function DeleteFriend(props) {
    // State
    const { User, profileUser, setalreadyafriend } = props;

    // Comportement
    // Suppression d'un follow depuis le profil d'un autre utilisateur
    const handledelFriend = () => {
        const delFriend = {
            UserID: User.id,
            friendID: profileUser.id,
        };

        axios.delete("/api/Friends/deletefriend", { data: delFriend });
        setalreadyafriend(false);
    };

    // Affichage
    return (
        <button
            type="button"
            className="adddelete-button"
            onClick={handledelFriend}
        >
            <p>Unfollow</p>
            <FontAwesomeIcon icon={faUserMinus} />
        </button>
    );
}
