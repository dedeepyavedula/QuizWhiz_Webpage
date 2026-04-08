from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# 🏠 HOME
@app.route('/')
def home():
    return render_template('home.html')


# 🔐 LOGIN PAGE
@app.route('/login')
def login():
    return render_template('login.html')


# 📥 LOGIN SUBMIT → insert into results (name, score=0)
@app.route('/login_submit', methods=['POST'])
def login_submit():
    username = request.form.get('username')

    conn = sqlite3.connect('quiz.db')
    c = conn.cursor()

    c.execute("INSERT INTO results (name, score) VALUES (?, ?)", (username, 0))

    conn.commit()
    conn.close()

    return redirect(url_for('quiz', user=username))


# 🧪 QUIZ PAGE
@app.route('/quiz/<user>')
def quiz(user):
    return render_template('quiz.html', username=user)


# 📊 RESULT PAGE → update score
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
