import { React, useState } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function EditProfile(props) {
    const { User, setUser, setInfo, setInformation } = props;

    //States
    const [newUsername, setNewUsername] = useState("");
    const [image, setImage] = useState(User.profilpicture);
    const [banner, setBanner] = useState(User.banner);
    const [usermessage, setUserMessage] = useState("");
    const [settingsLoading, setSettingsLoading] = useState(false);

    // Comportement
    const handleChange = (event) => {
        setNewUsername(event.target.value);
    };

    // Mise à jour du nom d'utilisateur
    const handleEditUsername = (event) => {
        event.preventDefault();
        setSettingsLoading(true);
        axios
            .put("/api/Form/changeusername", {
                newUsername: newUsername,
                username: User.username,
            })
            .then((res) => {
                setUserMessage(
                    <p style={{ color: "green" }}>{res.data.message}</p>
                );
                const Userupdate = Object.assign({}, User, {
                    username: newUsername,
                });
                setUser(Userupdate);
                setSettingsLoading(false);
            })
            .catch((error) => {
                const response = error.response.data;
                setUserMessage(
                    <p style={{ color: "red" }}>{response.message}</p>
                );
                setSettingsLoading(false);
            });
    };

    // Conversion d'un fichier en un lien pour l'api Cloudinary
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // Mise à jour de la photo de profil d'un utilisateur
    const handleOpenFileInput = async (event) => {
        const base64 = await convertBase64(event.target.files[0]);
        setImage(base64);
    };

    const handleSubmitImage = () => {
        setSettingsLoading(true);
        axios
            .post("/api/image/uploadimage", {
                image: image,
                public_id: User.id,
                type: "profilpicture",
            })
            .then(() => {
                const Userupdate = Object.assign({}, User, {
                    profilpicture: image,
                });
                setTimeout(() => {
                    setUser(Userupdate);
                    setSettingsLoading(false);
                    setInfo(true);
                    setInformation("Image Uploaded !");
                }, 2000);
            });
    };

    // Mise à jour de la bannière d'un utilisateur
    const handleOpenFileInputBanner = async (event) => {
        const base64 = await convertBase64(event.target.files[0]);
        setBanner(base64);
    };

    const handleSubmitBanner = () => {
        setSettingsLoading(true);
        axios
            .post("/api/image/uploadimage", {
                image: banner,
                public_id: User.id,
                type: "banner",
            })
            .then(() => {
                const Userupdate = Object.assign({}, User, { banner: banner });
                setTimeout(() => {
                    setUser(Userupdate);
                    setSettingsLoading(false);
                    setInfo(true);
                    setInformation("Image Uploaded !");
                }, 2000);
            });
    };

    // Affichage
    return settingsLoading ? (
        <div className="Settings loading-screen">
            <span className="loading-circle"></span>
        </div>
    ) : (
        <section className="Settings">
            <div className="Settings-title">Customize profile</div>
            <div className="Settings-descriptor">
                On a stroll for a fresh look ?
            </div>
            <div className="editSettings-container">
                <div className="editSettings-username">
                    <span className="editSettings-subtitle">Username</span>
                    <span className="editSettings-subdescriptor">
                        Set your username. This affects your login information.
                    </span>
                    <form
                        className="edit-username-form"
                        action="submit"
                        onSubmit={handleEditUsername}
                    >
                        <input
                            type="text"
                            className="edit-username-input"
                            placeholder="Enter your new username"
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="fileInput-button">
                            Submit
                        </button>
                        {usermessage}
                    </form>
                </div>
                <div className="editSettings-picture">
                    <span className="editSettings-subtitle">
                        Profile picture
                    </span>
                    <span className="editSettings-subdescriptor">
                        Image must be a .png, .jpg or .gif format.
                    </span>

                    <div className="edit-pp-banner">
                        <Avatar
                            src={image}
                            alt="Your profile picture"
                            className="settingspp-container"
                            sx={{ width: 120, height: 120 }}
                        />
                        <form
                            className="profilepicForm"
                            onSubmit={handleSubmitImage}
                        >
                            <label className="fileInput">
                                <input
                                    className="fileInput-button"
                                    type="file"
                                    onChange={handleOpenFileInput}
                                    required
                                />
                                <FontAwesomeIcon id="faicon" icon={faPlus} />
                            </label>
                            <button type="submit" className="fileInput-button">
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
                <div className="editSettings-banner">
                    <span className="editSettings-subtitle">Banner</span>
                    <span className="editSettings-subdescriptor">
                        Image must be a .png, .jpg or .gif format.
                    </span>

                    <div className="edit-pp-banner">
                        <div className="settingsbanner-container">
                            <img
                                id="banner"
                                className="brad"
                                src={banner}
                                alt="Bannière de l'utilisateur"
                            ></img>
                        </div>
                        <form
                            className="bannerForm"
                            onSubmit={handleSubmitBanner}
                        >
                            <label className="fileInput">
                                <input
                                    id="banner-upload"
                                    type="file"
                                    onChange={handleOpenFileInputBanner}
                                    required
                                />
                                <FontAwesomeIcon id="faicon" icon={faPlus} />
                            </label>
                            <button type="submit" className="fileInput-button">
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
