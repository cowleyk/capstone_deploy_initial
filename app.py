import os
from dotenv import load_dotenv
from flask import Flask, render_template, session, redirect, request
from flask_sqlalchemy import SQLAlchemy
from twitter_utils import get_request_token, get_oauth_verifier_url, get_access_token

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


app = Flask(__name__)

app.config.from_object(os.environ.get('APP_SETTINGS'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import Result

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

    result = db.session.execute(
        "SELECT * FROM users WHERE screen_name=:param",
        {"param": access_token['screen_name']}
    )
    row = result.fetchone()

    if not row:
        newscreenname = Result(
            screen_name=access_token['screen_name'],
            oauth_token=access_token['oauth_token'],
            oauth_token_secret=access_token['oauth_token_secret'],
            csv_data=None
        )
        db.session.add(newscreenname)
        db.session.commit()

        fetchnewscreenname = db.session.execute(
            "SELECT * FROM users WHERE screen_name=:param",
            {"param": access_token['screen_name']}
        )
        row = fetchnewscreenname.fetchone()
        print('newscreenname: {}'.format(row['screen_name']))

    session['screen_name'] = row['screen_name']
    return session['screen_name']


@app.route('/logout')
def logout():
    session.clear()
    return render_template('index.html')



if __name__ == '__main__':
    app.run()
