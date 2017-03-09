import oauth2
import constants
import urllib.parse
import json

consumer = oauth2.Consumer(constants.CONSUMER_KEY, constants.CONSUMER_SECRET)

def get_request_token():
    client = oauth2.Client(consumer)

    response, content = client.request(constants.REQUEST_TOKEN_URL, 'POST')
    if response.status != 200:
        print('An Error Occured getting request token from twitter')

    return dict(urllib.parse.parse_qsl(content.decode('utf-8')))

def get_oauth_verifier_url(request_token):
    return '{}?oauth_token={}'.format(constants.AUTHORIZATION_URL, request_token['oauth_token'])

def get_access_token(request_token, oauth_verifier):
    token = oauth2.Token(request_token['oauth_token'], request_token['oauth_token_secret'])
    token.set_verifier(oauth_verifier)

    client = oauth2.Client(consumer, token)

    response, content = client.request(constants.ACCESS_TOKEN_URL, 'POST')
    return dict(urllib.parse.parse_qsl(content.decode('utf-8')))

def twitter_request(oauth_token, oauth_token_secret, uri, verb):
    authorized_token = oauth2.Token(oauth_token, oauth_token_secret)
    # authorized_token sent w/ every request to twitter API
    authorized_client = oauth2.Client(consumer, authorized_token)

    # Make Twitter API calls
    resp, content = authorized_client.request(uri, verb)
    if resp.status != 200:
        print('An error occured when searching')

    twitfollowers = json.loads(content.decode('utf-8'))
    return twitfollowers
