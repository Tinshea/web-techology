class Message {
  constructor(userId, messageID, content, time, Likes = []) {
    this.userId = userId;
    this.messageID = messageID;
    this.content = content;
    this.time = time;
    this.Likes = Likes;
  }
}

module.exports = { Message };
