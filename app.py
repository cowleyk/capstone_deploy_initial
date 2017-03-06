import os
from dotenv import load_dotenv
from flask import Flask

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


app = Flask(__name__)

app.config.from_object(os.environ.get('APP_SETTINGS'))
print(os.environ['APP_SETTINGS'])

@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()
