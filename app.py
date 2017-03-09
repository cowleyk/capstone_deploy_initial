import os
from dotenv import load_dotenv
from flask import Flask, render_template, session, redirect, request, make_response
from flask_sqlalchemy import SQLAlchemy
from twitter_utils import get_request_token, get_oauth_verifier_url, get_access_token, twitter_request
from random import randint

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


app = Flask(__name__)

app.config.from_object(os.environ.get('APP_SETTINGS'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import Result

followerslist = []

@app.route('/')
def hello():
    if 'screen_name' in session:
        response = make_response(render_template('index.html'))
        response.set_cookie('screen_name', session['screen_name'])
        return response
    request_token = get_request_token()
    session['request_token'] = request_token

    return redirect(get_oauth_verifier_url(request_token))

    # original def hello():
        # return render_template('index.html')

@app.route('/login/twitter')
def twitter_login():
    if 'screen_name' in session:
        response = make_response(render_template('index.html'))
        response.set_cookie('screen_name', session['screen_name'])
        return response
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
        print('newscreenname db: {}'.format(row['screen_name']))

    session['screen_name'] = row['screen_name']
    session['oauth_token'] = row['oauth_token']
    session['oauth_token_secret'] = row['oauth_token_secret']

    followersuri = 'https://api.twitter.com/1.1/followers/list.json?cursor=-1&screen_name={}&skip_status=true&include_user_entities=false'.format(row['screen_name'])
    followers = twitter_request(row['oauth_token'], row['oauth_token_secret'], followersuri, 'GET')
    for fllw in followers['users']:
        followerslist.append(fllw['screen_name'])
    print(followerslist)
    response = make_response(render_template('index.html'))
    response.set_cookie('screen_name', session['screen_name'])
    return response

# @app.route('/senddm')
# def senddm():
#     randomnum = randint(0, len(followerslist)-1)
#     text = 'You%20should%20tryout%20linreg%20dash%20five%20dot%20herokuapp%20dot%20com!'
#     dmuri = 'https://api.twitter.com/1.1/direct_messages/new.json?text={}&screen_name={}'.format(text, followerslist[randomnum])
#     dmpost = twitter_request(session['oauth_token'], session['oauth_token_secret'], dmuri, 'POST')
#     print(dmpost)
#     return dmpost

@app.route('/logout')
def logout():
    session.clear()
    return render_template('index.html')

@app.route('/getuserdata')
def getuserdata():
    result = db.session.execute(
        "SELECT * FROM users WHERE screen_name=:param",
        {"param": session['screen_name']}
    )
    row = result.fetchone()
    returndata = '{}~{}'.format(row['screen_name'], row['csv_data'])
    print(returndata)
    return returndata


@app.route('/csvpost')
def csvpost():
    # pass
    csvcookie = request.cookies.get("csv_data")
    print('csvcookie: {}'.format(csvcookie))
    result = db.session.execute(
        "UPDATE users SET csv_data=:paramcsv WHERE screen_name=:param RETURNING csv_data",
        {"param": session['screen_name'], "paramcsv": csvcookie }
    )
    row = result.fetchone()
    db.session.commit()
    print('row[0]: {}'.format(row[0]))
    return row[0]

    # if not row['csv_data']:
    #     newscreenname = Result(
    #         screen_name=access_token['screen_name'],
    #         oauth_token=access_token['oauth_token'],
    #         oauth_token_secret=access_token['oauth_token_secret'],
    #         csv_data=None
    #     )
    #     db.session.add(newscreenname)
    #     db.session.commit()
    #
    #     fetchnewscreenname = db.session.execute(
    #         "SELECT * FROM users WHERE screen_name=:param",
    #         {"param": access_token['screen_name']}
    #     )
    #     row = fetchnewscreenname.fetchone()
    #     print('newscreenname db: {}'.format(row['screen_name']))




if __name__ == '__main__':
    app.run()
