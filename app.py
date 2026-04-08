from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# 🗄️ CREATE TABLES (run once automatically)
def init_db():
    conn = sqlite3.connect('quiz.db')
    c = conn.cursor()

    # users table (for login credentials)
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
    )
    ''')

    # results table (for quiz scores)
    c.execute('''
    CREATE TABLE IF NOT EXISTS results (
    username TEXT,
    quiz_name TEXT,
    score INTEGER,
    PRIMARY KEY (username, quiz_name)
    )
    ''')

    conn.commit()
    conn.close()

init_db()


# 🏠 HOME
@app.route('/')
def home():
    return render_template('home.html')


# 🔐 LOGIN PAGE
@app.route('/login')
def login():
    return render_template('login.html')


# 📝 SIGN-UP PAGE
@app.route('/signup')
def signup():
    return render_template('sign_up_page.html')


# 📥 SIGN-UP SUBMIT
@app.route('/signup_submit', methods=['POST'])
def signup_submit():
    username = request.form.get('username')
    password = request.form.get('password')

    conn = sqlite3.connect('quiz.db')
    c = conn.cursor()

    # check if user already exists
    c.execute("SELECT * FROM users WHERE username=?", (username,))
    existing_user = c.fetchone()

    if existing_user:
        conn.close()
        return "Username already exists!"

    # insert new user
    c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    conn.commit()
    conn.close()

    return redirect(url_for('login'))


# 📥 LOGIN SUBMIT (check username + password)
@app.route('/login_submit', methods=['POST'])
def login_submit():
    username = request.form.get('username')
    password = request.form.get('password')

    conn = sqlite3.connect('quiz.db')
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
    user = c.fetchone()

    if user:
        # ensure entry exists in results table
        c.execute("SELECT * FROM results WHERE name=?", (username,))
        exists = c.fetchone()

        if not exists:
            c.execute("INSERT INTO results (name, score) VALUES (?, ?)", (username, 0))
            conn.commit()

        conn.close()
        return redirect(url_for('quiz', user=username))
    else:
        conn.close()
        return "Invalid username or password!"


# 🧪 QUIZ PAGE
@app.route('/quiz/<user>')
def quiz(user):
    return render_template('quiz.html', username=user)


# 📊 RESULT PAGE
@app.route('/result/<user>/<int:score>')
def result(user, score):
    conn = sqlite3.connect('quiz.db')
    c = conn.cursor()

    c.execute("UPDATE results SET score=? WHERE name=?", (score, user))

    conn.commit()
    conn.close()

    return render_template('result.html', username=user, score=score)


if __name__ == '__main__':
    app.run(debug=True)
