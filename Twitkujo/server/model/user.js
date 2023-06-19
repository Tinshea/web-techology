class User {
  constructor(
    id,
    username,
    password,
    profilpicture,
    banner,
    theme,
    nbfollowers
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.profilpicture = profilpicture;
    this.banner = banner;
    this.theme = theme;
    this.nbfollowers = nbfollowers;
  }
}
module.exports = { User };
