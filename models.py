from app import db
from sqlalchemy.dialects.postgresql import TEXT


class Result(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    screen_name = db.Column(db.String())
    oauth_token = db.Column(db.String())
    oauth_token_secret = db.Column(db.String())
    csv_data = db.Column(TEXT)

    def __init__(self, screen_name, oauth_token, oauth_token_secret, csv_data):
        self.screen_name = screen_name
        self.oauth_token = oauth_token
        self.oauth_token_secret = oauth_token_secret
        self.csv_data = csv_data

    def __repr__(self):
        return '<id {}>'.format(self.id)
