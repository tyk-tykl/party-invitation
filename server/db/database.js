const Database = require('better-sqlite3')

const db = new Database('party.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    food_preferences TEXT,
    food_restrictions TEXT,
    drink_preferences TEXT,
    drink_restrictions TEXT,
    selected_gift INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL,
    link TEXT,
    reserved_by INTEGER,
    FOREIGN KEY (reserved_by) REFERENCES guests(id)
  )
`)

const wishlistCount = db
    .prepare('SELECT COUNT(*) AS count FROM wishlist')
    .get()

if (wishlistCount.count === 0) {
  const insertGift = db.prepare(`
    INSERT INTO wishlist (
      title,
      description,
      price,
      link
    )
    VALUES (?, ?, ?, ?)
  `)

  insertGift.run(
      'Наушники',
      'Хорошие беспроводные наушники',
      150,
      'https://example.com'
  )

  insertGift.run(
      'Книга',
      'Книга, которую я давно хочу',
      40,
      'https://example.com'
  )

  insertGift.run(
      'Что-нибудь для дома',
      'На твой вкус ❤️',
      50,
      'https://example.com'
  )
}

module.exports = db