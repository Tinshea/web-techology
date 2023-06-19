import { useEffect, useState } from "react";
import "../Css/friendlist.css";
// import gif from "../ressources/no_bitches.gif";
import Friend from "./Friend";
import axios from "axios";
import { Skeleton, Typography } from "@mui/material";

export default function FriendList(props) {
    const {
        setCurrentPage,
        User,
        setProfileUser,
        FriendList,
        setFriendList,
        profileUser,
        currentPage,
    } = props;

    //States
    const [clickStatus, setClickStatus] = useState(false);
    const [friendlistLoading, setFriendlistLoading] = useState(true);

    // Constante comportant l'affichage de chargement d'un utilisateur dans la liste de follow
    const friendPreview = (
        <div className="skeleton-friend">
            <Skeleton
                className="skel-friend-pp"
                variant="circular"
                height={"40px"}
                width={"40px"}
                animation={"wave"}
            />
            <div className="skel-username">
                <Typography variant="body2"/>
                <Skeleton />
            </div>
        </div>
    );

    // Comportement
    // Rafraîchissement de la liste de follow sur le profil d'un utilisateur
    useEffect(() => {
        setFriendlistLoading(true);
        axios
            .get("/api/Friends/refreshlistfriends", {
                params: { UserId: profileUser.id },
            })
            .then((res) => {
                setFriendList(res.data);
                setTimeout(() => {
                    setFriendlistLoading(false);
                }, 1000);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileUser, clickStatus]);

    // Affichage
    return friendlistLoading ? (
        // Si la liste de "follow" est en chargement, on affiche des skeleton animés
        <div className="friendlist-container"> 
            <h1>Follow List </h1>
            {friendPreview}
            {friendPreview}
            {friendPreview}
            {friendPreview}
            {friendPreview}
            {friendPreview}
            {friendPreview}
        </div> ) : (
        FriendList.length === 0 ? (
            // Si la liste de "follow" est vide, alors on affiche un message
            <div className="friendlist-container">
                {User.id === profileUser.id ? (
                    <div className="prompt">
                    <h1>No follows ?</h1>
                    <h2>
                        You can add people to your follow list by visiting
                        their profile and clicking the 'Follow' button !
                        <br />
                        To visit one's profile, click on their profile picture
                        or their username in one of their messages.
                    </h2>
                </div>
                ) : (
                    <div className="prompt">
                        <h1>Follow List</h1>
                        <h2>
                            {profileUser.username} doesn't follow anyone... Yet !
                            <br/>
                            <br/>   
                            May they find their favorite Greamers on Twitkujo
                            and they shall appear in this very list !
                        </h2>
                    </div>
                )}
                    
            </div>
        ) : (
        // Sinon on affiche la liste de "follow" de l'utilisateur
        // ou celle de l'utilisateur du profil affiché
        <div className="friendlist-container">
            <h1>Follow List </h1>
            <section className="section-friendlist">
                <ul>
                    {FriendList.map((friend) => {
                        return (
                            <Friend
                                setCurrentPage={setCurrentPage}
                                friend={friend}
                                setProfileUser={setProfileUser}
                                key={friend.friendID}
                                currentPage={currentPage}
                                User={User}
                                setClickStatus={setClickStatus}
                                profileUser={profileUser}
                                setFriendList={setFriendList}
                                FriendList={FriendList}
                                setFriendlistLoading={setFriendlistLoading}
                            />
                        );
                    })}
                </ul>
            </section>
        </div>
        )
    );
}
