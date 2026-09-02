import { useState } from 'react'

const foodOptions = [
  '🍕 Пицца',
  '🍔 Бургеры',
  '🍣 Суши',
  '🍗 Мясо',
  '🥗 Салаты',
  '🍟 Закуски',
  '🍰 Десерты',
]

const drinkOptions = [
  '🥤 Газировка',
  '🧃 Сок',
  '💧 Вода',
  '☕ Кофе',
  '🍵 Чай',
]

const wishlistItems = [
    {
        id: 1,
        title: 'Наушники',
        description: 'Хорошие беспроводные наушники',
        price: 150,
        link: 'https://example.com',
    },
    {
        id: 2,
        title: 'Книга',
        description: 'Книга, которую я давно хочу',
        price: 40,
        link: 'https://example.com',
    },
    {
        id: 3,
        title: 'Что-нибудь для дома',
        description: 'На твой вкус ❤️',
        price: 50,
        link: 'https://example.com',
    },
]

function App() {
    const [screen, setScreen] = useState('welcome')

    const [guestName, setGuestName] = useState('')

    const [foodPreferences, setFoodPreferences] = useState<string[]>([])
    const [drinkPreferences, setDrinkPreferences] = useState<string[]>([])

    const [foodRestrictions, setFoodRestrictions] = useState('')
    const [drinkRestrictions, setDrinkRestrictions] = useState('')

    const [selectedGift, setSelectedGift] = useState<number | null>(null)

  const toggleFood = (food: string) => {
    setFoodPreferences((current) =>
        current.includes(food)
            ? current.filter((item) => item !== food)
            : [...current, food]
    )
  }

  const toggleDrink = (drink: string) => {
    setDrinkPreferences((current) =>
        current.includes(drink)
            ? current.filter((item) => item !== drink)
            : [...current, drink]
    )
  }

  if (screen === 'food') {
    return (
        <main>
          <h1>🍕 Еда</h1>

          <p>Что ты будешь есть?</p>

          {foodOptions.map((food) => (
              <button
                  key={food}
                  onClick={() => toggleFood(food)}
              >
                {food} {foodPreferences.includes(food) ? '✓' : ''}
              </button>
          ))}

          <br />
          <br />

          <p>Есть что-то, что ты не ешь?</p>

          <input
              type="text"
              placeholder="Например: орехи"
              value={foodRestrictions}
              onChange={(event) => setFoodRestrictions(event.target.value)}
          />

          <br />
          <br />

          <button onClick={() => setScreen('drinks')}>
            Дальше →
          </button>
        </main>
    )
  }

  if (screen === 'drinks') {
    return (
        <main>
          <h1>🥤 Напитки</h1>

          <p>Что ты будешь пить?</p>

          {drinkOptions.map((drink) => (
              <button
                  key={drink}
                  onClick={() => toggleDrink(drink)}
              >
                {drink} {drinkPreferences.includes(drink) ? '✓' : ''}
              </button>
          ))}

          <br />
          <br />

          <p>Есть напитки, которые ты не пьёшь?</p>

          <input
              type="text"
              placeholder="Например: кофе"
              value={drinkRestrictions}
              onChange={(event) => setDrinkRestrictions(event.target.value)}
          />

          <br />
          <br />

          <button onClick={() => setScreen('wishlist')}>
            Дальше →
          </button>
        </main>
    )
  }

  if (screen === 'wishlist') {
        return (
            <main>
                <h1>🎁 Вишлист</h1>

                <p>
                    Если захочешь что-нибудь подарить,
                    вот мой небольшой список желаний.
                </p>

                {wishlistItems.map((item) => (
                    <div key={item.id}>
                        <h2>{item.title}</h2>

                        <p>{item.description}</p>

                        <p>≈ {item.price} BYN</p>

                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Посмотреть
                        </a>

                        <br />

                        <button
                            onClick={() => setSelectedGift(item.id)}
                        >
                            {selectedGift === item.id
                                ? '✓ Я выберу этот подарок'
                                : 'Я подарю это'}
                        </button>

                        <hr />
                    </div>
                ))}

                <button onClick={() => setScreen('finish')}>
                    Завершить →
                </button>
            </main>
        )
  }

  if (screen === 'finish') {
    return (
        <main>
          <h1>💌 Всё готово, {guestName}!</h1>

          <p>Спасибо, что заполнил(а) приглашение.</p>

          <p>
            Теперь осталось самое главное —
            прийти и хорошо провести время!
          </p>

          <button>
            💬 Вступить в Telegram
          </button>
        </main>
    )
  }

  return (
        <main>
            <h1>Ты приглашён!</h1>

            <p>Буду рада видеть тебя на моём празднике 💌</p>

            <p>📅 19 сентября</p>
            <p>🕐 19:00</p>
            <p>📍 Гродно</p>

            <p>Как тебя зовут?</p>

            <input
                type="text"
                placeholder="Твоё имя"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
            />

            <br />
            <br />

            <button
                onClick={() => setScreen('food')}
                disabled={!guestName.trim()}
            >
                Открыть приглашение
            </button>
        </main>
  )
}

export default App