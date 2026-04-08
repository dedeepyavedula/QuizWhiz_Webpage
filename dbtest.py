import sqlite3

conn = sqlite3.connect('quiz.db')
c = conn.cursor()

print("ID   Name         Score")
print("---------------------------")

for row in c.execute("SELECT * FROM results"):
    print(f"{row[0]:<5}{row[1]:<13}{row[2]}")

conn.close()
