import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

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

function App() {
    const adminMode = window.location.pathname === '/admin'

    const [adminPassword, setAdminPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const [screen, setScreen] = useState('welcome')

    const [guestName, setGuestName] = useState('')

    const [foodPreferences, setFoodPreferences] = useState<string[]>([])
    const [drinkPreferences, setDrinkPreferences] = useState<string[]>([])

    const [customFood, setCustomFood] = useState('')
    const [customDrink, setCustomDrink] = useState('')

    const [foodRestrictions, setFoodRestrictions] = useState('')
    const [drinkRestrictions, setDrinkRestrictions] = useState('')

    const [selectedGift, setSelectedGift] = useState<number | null>(null)

    const [wishlistItems, setWishlistItems] = useState<any[]>([])
    const [wishlistLoaded, setWishlistLoaded] = useState(false)

    const [guests, setGuests] = useState<any[]>([])
    const [guestsLoaded, setGuestsLoaded] = useState(false)

    useEffect(() => {
        if (!adminMode || guestsLoaded) {
            return
        }

        fetch(`${API_URL}/api/guests`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                return response.json()
            })
            .then((data) => {
                console.log('Гости загружены:', data)

                setGuests(data)
                setGuestsLoaded(true)
            })
            .catch((error) => {
                console.error('Ошибка загрузки гостей:', error)
            })
    }, [adminMode, guestsLoaded])

    useEffect(() => {
        if (!wishlistLoaded && (screen === 'wishlist' || adminMode)) {
            fetch(`${API_URL}/api/wishlist`)
                .then((response) => response.json())
                .then((data) => {
                    setWishlistItems(data)
                    setWishlistLoaded(true)
                })
                .catch((error) => {
                    console.error('Ошибка загрузки вишлиста:', error)
                })
        }
    }, [screen, adminMode, wishlistLoaded])

    const submitGuest = async () => {
        const guest = {
            name: guestName,
            foodPreferences: [
                ...foodPreferences,
                ...(customFood.trim() ? [`✏️ ${customFood.trim()}`] : []),
            ],
            foodRestrictions,
            drinkPreferences: [
                ...drinkPreferences,
                ...(customDrink.trim() ? [`✏️ ${customDrink.trim()}`] : []),
            ],
            drinkRestrictions,
            selectedGift,
        }

        try {
            const response = await fetch(
                `${API_URL}/api/guests`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(guest),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.message)
                return
            }

            console.log('Гость сохранён:', data)

            setScreen('finish')
        } catch (error) {
            console.error('Ошибка отправки:', error)
            alert('Не удалось сохранить ответы')
        }
    }

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

    if (adminMode && !isAdmin) {
        return (
            <main>
                <h1>🔐 Админка</h1>

                <p>Введите пароль:</p>

                <input
                    type="password"
                    value={adminPassword}
                    onChange={(event) =>
                        setAdminPassword(event.target.value)
                    }
                />

                <br />
                <br />

                <button
                    onClick={() => {
                        if (adminPassword === '1234') {
                            setIsAdmin(true)
                        } else {
                            alert('Неверный пароль')
                        }
                    }}
                >
                    Войти
                </button>
            </main>
        )
    }

    if (adminMode && isAdmin) {
        return (
            <main>
                <h1>🔐 Админка</h1>

                <h2>👥 Гости</h2>

                {!guestsLoaded && (
                    <p>Загружаем гостей...</p>
                )}

                {guests.map((guest) => (
                    <div key={guest.id}>
                        <h3>{guest.name}</h3>

                        <p>
                            🍕 Еда:{' '}
                            {JSON.parse(
                                guest.food_preferences || '[]'
                            ).join(', ')}
                        </p>

                        <p>
                            🚫 Не ест:{' '}
                            {guest.food_restrictions || '—'}
                        </p>

                        <p>
                            🥤 Напитки:{' '}
                            {JSON.parse(
                                guest.drink_preferences || '[]'
                            ).join(', ')}
                        </p>

                        <p>
                            🚫 Не пьёт:{' '}
                            {guest.drink_restrictions || '—'}
                        </p>

                        <p>
                            🎁 Подарок ID:{' '}
                            {guest.selected_gift || 'Не выбран'}
                        </p>

                        <p>
                            📅 {guest.created_at}
                        </p>

                        <hr />
                    </div>
                ))}

                <h2>🎁 Вишлист</h2>

                {!wishlistLoaded && (
                    <p>Загружаем вишлист...</p>
                )}

                {wishlistItems.map((item) => (
                    <div key={item.id}>
                        <h3>
                            #{item.id} — {item.title}
                        </h3>

                        <p>{item.description}</p>

                        <p>💰 {item.price} BYN</p>

                        <p>
                            {item.reserved
                                ? '🔴 Подарок выбран'
                                : '🟢 Подарок свободен'}
                        </p>

                        <hr />
                    </div>
                ))}
            </main>
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

            <p>Что-нибудь ещё?</p>

            <input
                type="text"
                placeholder="Например: паста"
                value={customFood}
                onChange={(event) => setCustomFood(event.target.value)}
            />

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

            <p>Что-нибудь ещё?</p>

            <input
                type="text"
                placeholder="Например: лимонад"
                value={customDrink}
                onChange={(event) => setCustomDrink(event.target.value)}
            />

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

                {!wishlistLoaded && (
                    <p>Загружаем список подарков...</p>
                )}

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
                        <br />

                        <button
                            onClick={() => setSelectedGift(item.id)}
                            disabled={item.reserved}
                        >
                            {item.reserved
                                ? '🎁 Уже выбран'
                                : selectedGift === item.id
                                    ? '✓ Я выберу этот подарок'
                                    : 'Я подарю это'}
                        </button>

                        <hr />
                    </div>
                ))}

                <button onClick={submitGuest}>
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

                {selectedGift ? (
                    <p>🎁 Твой подарок №{selectedGift}</p>
                ) : (
                    <p>🎁 Подарок не выбран</p>
                )}

                <button
                    onClick={() =>
                        window.open(
                            'https://t.me/+XkVCjp2GJ3E2ZWY6',
                            '_blank'
                        )
                    }
                >
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