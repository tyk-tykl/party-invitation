const express = require('express')
const cors = require('cors')

const db = require('./db/database')
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Сервер работает!'
    })
})

app.post('/api/guests', (req, res) => {
    const {
        name,
        foodPreferences,
        foodRestrictions,
        drinkPreferences,
        drinkRestrictions,
        selectedGift,
    } = req.body

    if (selectedGift !== null) {
        const gift = db
            .prepare('SELECT * FROM wishlist WHERE id = ?')
            .get(selectedGift)

        if (!gift) {
            return res.status(404).json({
                message: 'Выбранный подарок не найден'
            })
        }

        if (gift.reserved_by !== null) {
            return res.status(409).json({
                message: 'К сожалению, этот подарок уже выбрали'
            })
        }
    }

    const statement = db.prepare(`
    INSERT INTO guests (
      name,
      food_preferences,
      food_restrictions,
      drink_preferences,
      drink_restrictions,
      selected_gift
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)

    const result = statement.run(
        name,
        JSON.stringify(foodPreferences),
        foodRestrictions,
        JSON.stringify(drinkPreferences),
        drinkRestrictions,
        selectedGift
    )

    if (selectedGift !== null) {
        const gift = db
            .prepare('SELECT * FROM wishlist WHERE id = ?')
            .get(selectedGift)

        if (gift && gift.reserved_by === null) {
            db.prepare(`
      UPDATE wishlist
      SET reserved_by = ?
      WHERE id = ?
    `).run(result.lastInsertRowid, selectedGift)
        }
    }

    console.log('Гость сохранён:', name)

    res.status(201).json({
        message: 'Гость сохранён',
        id: result.lastInsertRowid
    })
})

app.get('/api/guests', (req, res) => {
    const guests = db
        .prepare('SELECT * FROM guests ORDER BY created_at DESC')
        .all()

    res.json(guests)
})

app.get('/api/wishlist', (req, res) => {
    const wishlist = db
        .prepare(`
      SELECT
        id,
        title,
        description,
        price,
        link,
        reserved_by IS NOT NULL AS reserved
      FROM wishlist
    `)
        .all()

    res.json(wishlist)
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`)
})