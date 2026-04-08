import sqlite3

conn = sqlite3.connect('quiz.db')
c = conn.cursor()

# USERS TABLE
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
)
''')

# RESULTS TABLE
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
