import axios from "axios";
import "../Css/friend.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddFriend(props) {
    const { User, profileUser, setalreadyafriend } = props;

    // Comportement
    // Ajout d'un follow depuis le profil d'un autre utilisateur
    const handleAddFriend = () => {
        const addFriend = {
            userID: User.id,
            friendID: profileUser.id,
        };
        axios.post("/api/Friends/addFriends", addFriend);
        setalreadyafriend(true);
    };

    // Affichage
    return (
        <button
            type="button"
            className="adddelete-button"
            onClick={handleAddFriend}
        >
            <span>Follow</span>
            <FontAwesomeIcon icon={faUserPlus} />
        </button>
    );
}
