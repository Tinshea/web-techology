import { useState } from "react";
// import { useEffect } from "react";
import "../Css/message.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function AddMessage(props) {
    // State
    const [newmessage, setNewMessage] = useState("");
    const { User, setMessagesList, messageslist, setRefreshMessages } = props;

    //State de démonstration
    // const [msgsent, setmsgsent] = useState(false);

    // Comportement
    const handleChange = (event) => {
        setNewMessage(event.target.value);
    };

    // Ajout d'un message (dans la BDD et dans l'affichage)
    const handleAdd = (event) => {
        event.preventDefault();
        //Console log len avant (vidéo)
        // console.log("Avant l'ajout : len(messagelist) = ", messageslist.length);
        const addMessage = {
            userId: User.id,
            messageID: new Date().getTime().toString(),
            content: newmessage,
            Likes: [],
        };
        //Console log contenu (vidéo)
        // console.log("Contenu du message côté client :", addMessage);
        axios
            .post("/api/Message/addMessage", addMessage)
            .then(() => {
                const MessageListcopie = [addMessage, ...messageslist];
                setMessagesList(MessageListcopie);
                setNewMessage("");
                setRefreshMessages((prev) => !prev);

                // Mise à jour du state pour la démonstration (vidéo)
                // setmsgsent(true);
            })
            .catch((error) => {
                const response = error.response.data;
                alert(response.message);
            });
    };

    //Fonction Console log len après (vidéo)
    // function checkMessagesListLen() {
    //   if (messageslist !== undefined && msgsent) {
    //     console.log("Après l'ajout : len(messageslist) = ", messageslist.length);
    //   }
    // }
    // useEffect(() => {
    //   checkMessagesListLen();
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [msgsent]);

    // Affichage
    return (
        <div className="AddMessage">
            <form
                className="AddMessage-form"
                action="submit"
                onSubmit={handleAdd}
            >
                <input
                    className="AddMessage-input"
                    placeholder="Laissez place à votre imagination..."
                    value={newmessage}
                    onChange={handleChange}
                    required
                />
                <button className="SendButton">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
        </div>
    );
}
