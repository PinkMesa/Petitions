export default class Petition {
  constructor(id, title, category, description, creator, votes_count, created_date, answer) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.description = description;
    this.creator = creator;
    this.votes_count = votes_count;
    this.created_date = new Date(created_date);
    //this.expiration_date = new Date(created_date); // +2 weeks in msecs
    this.answer = answer;
  }
}
