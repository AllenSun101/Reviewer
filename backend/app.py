from flask import Flask

app = Flask(__name__)

def calculate_rating():
    # Preference weights
    # weight * keyword
    return 0

def add_review():
    # keyword similarity
    return 0

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
