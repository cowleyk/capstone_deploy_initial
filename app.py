import os
from dotenv import load_dotenv
from flask import Flask, render_template, session, redirect, request
from flask_sqlalchemy import SQLAlchemy
from twitter_utils import get_request_token, get_oauth_verifier_url, get_access_token
from user import User
from database import Database


dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


app = Flask(__name__)

app.config.from_object(os.environ.get('APP_SETTINGS'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import Result

Database.initialize(host='localhost', database='linreg', user='postgres', password='1234')

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/login/twitter')
def twitter_login():
    if 'screen_name' in session:
        return session['screen_name']
    request_token = get_request_token()
    session['request_token'] = request_token

    return redirect(get_oauth_verifier_url(request_token))

@app.route('/auth/twitter')
def twitter_auth():
    oauth_verifier = request.args.get('oauth_verifier')
    access_token = get_access_token(session['request_token'], oauth_verifier)

    user = User.load_from_db_by_screen_name(access_token['screen_name'])
    if not user:
        user = User(access_token['screen_name'], access_token['oauth_token'],
                    access_token['oauth_token_secret'], None)
        user.save_to_db()

    session['screen_name'] = user.screen_name

    return 'hello there {}'.format(user.screen_name)


if __name__ == '__main__':
    app.run()
