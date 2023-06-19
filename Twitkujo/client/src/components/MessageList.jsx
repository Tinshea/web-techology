import { useEffect, useState } from "react";
import Message from "./Message";
import AddMessage from "./AddMessage";
import axios from "axios";
import { Skeleton, Typography } from "@mui/material";
import MessagePreview from "./MessagePreview";

export default function MessageList(props) {
    const {
        setCurrentPage,
        User,
        setProfileUser,
        profileUser,
        datamess,
        currentPage,
        timefilter,
        loading,
        setLoading,
    } = props;
    // States
    const [messageslist, setMessagesList] = useState();
    const [hasMessages, setHasMessages] = useState(false);
    const [refreshMessages, setRefreshMessages] = useState(false);

    // Comportement
    // Rafraîchissement de la liste des messages selon l'utilisateur affiché (profile ou non)
    useEffect(() => {
        const fetchData = async () => {
            const sort = timefilter === false ? "desc" : "asc";
            setLoading(true);
            await axios
                .get("/api/Message/refreshlistMessage", {
                    params: {
                        userId: profileUser ? profileUser.id : undefined,
                        sortBy: sort, // ou 'asc' pour trier dans l'ordre ascendant
                    },
                })
                .then((res) => {
                    setMessagesList(res.data);
                    setHasMessages(res.data.length > 0);
                    setLoading(false);
                })
                .catch((error) => {
                    setHasMessages(false);
                    console.log(error);
                    const response = error.response.data;
                    alert(response);
                });
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileUser.id, refreshMessages, timefilter]);

    useEffect(() => {
        setMessagesList(datamess);
    }, [datamess]);

    //Suppression d'un message (bouton affiché seulement si le message appartient à l'utilisateur)
    const handleDelete = async (id, user) => {
        if (User.id === user) {
            await axios
                .delete("/api/Message/deletemessage", {
                    data: { User: User.id, messageID: id },
                })
                .then(() => {
                    const MessageListCopy = [...messageslist];
                    const MessageListCopyUpdated = MessageListCopy.filter(
                        (message) => message.messageID !== id
                    );
                    setMessagesList(MessageListCopyUpdated);
                    setRefreshMessages((prev) => !prev);
                    console.log("Message has been deleted");
                })
                .catch((error) => {
                    const response = error.response.data;
                    alert(response.message);
                });
        } else {
            alert("This message does not belong to you");
        }
    };

    // Constante contenant l'affichage de chargement des messages
    const skeletonMessage = (
        <div className="skeleton-message brad">
            <Skeleton
                className="skeleton-pp"
                variant="circular"
                width={"64px"}
                height={"64px"}
            />
            <Skeleton
                variant="rectangular"
                sx={{
                    margin: "1em",
                    height: "250px",
                    background: "var(--background-color)",
                    borderRadius: "10px",
                }}
            />
            <div className="skeleton-text">
                <Typography variant="body1" sx={{ bottom: "7%" }}>
                    <Skeleton />
                </Typography>
                <Typography variant="body1" sx={{ bottom: "25%" }}>
                    <Skeleton />
                </Typography>
                <Typography variant="body1" sx={{ bottom: "44%" }}>
                    <Skeleton />
                </Typography>
            </div>
        </div>
    );

    // Affichage
    return hasMessages ? (
        // Si la liste de message récupérée n'est pas vide, alors on affiche la liste
        <div>
            <section className="section-mainpage">
                {(User.id === profileUser.id &&
                    currentPage === "ProfilePage") ||
                currentPage === "MainPage" ? (
                    <div className="AddMessage-top">
                        <AddMessage
                            User={User}
                            setMessagesList={setMessagesList}
                            messageslist={messageslist}
                            setRefreshMessages={setRefreshMessages}
                        />
                    </div>
                ) : null}
                {loading ? (
                    // Si nous sommes en chargement, on affiche un skeleton animé
                    <div>
                        {skeletonMessage}
                        {skeletonMessage}
                        {skeletonMessage}
                    </div>
                ) : (
                    // Sinon on affiche les messages récupérés
                    <ul>
                        {messageslist.map((message) => {
                            return (
                                <Message
                                    setCurrentPage={setCurrentPage}
                                    User={User}
                                    setProfileUser={setProfileUser}
                                    messageinfo={message}
                                    onMessageDelete={handleDelete}
                                    key={message.messageID}
                                />
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    ) : (
        // Sinon on affiche "MessagePreview" qui affiche l'aperçu d'un message
        <div>
            <section className="section-mainpage">
                {(User.id === profileUser.id &&
                    currentPage === "ProfilePage") ||
                currentPage === "MainPage" ? (
                    <div className="AddMessage-top">
                        <AddMessage
                            User={User}
                            setMessagesList={setMessagesList}
                            messageslist={messageslist}
                            setRefreshMessages={setRefreshMessages}
                        />
                    </div>
                ) : null}
                {loading ? (
                    // Si nous sommes en chargement, alors on affiche un skeleton animé
                    <div>{skeletonMessage}</div>
                ) : (
                    // Sinon on affiche "MessagePreview"
                    <div>
                        <p className="Nomess-p-MessageList blur-filter">
                            No messages were found...
                            <br />
                            <br />
                            Here's a preview of your first message !
                        </p>

                        <MessagePreview User={User} />
                    </div>
                )}
            </section>
        </div>
    );
}
