import { useEffect, useState } from 'react'

const foodOptions = [
  'Пицца',
  'Суши',
  'Шашлык',
  'Салаты',
  'Закуски',
  'Торт',
]

const drinkOptions = [
  'Газировка',
  'Сок',
  'Вода',
  'Чай/кофе',
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

    const [customFood, setCustomFood] = useState('')

    const [foodRestrictions, setFoodRestrictions] = useState('')
    const [drinkRestrictions, setDrinkRestrictions] = useState('')

    const [selectedGift, setSelectedGift] = useState<number | null>(null)

    const [alcohol, setAlcohol] = useState('')

    const [reservedGifts, setReservedGifts] = useState<number[]>([])

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetch(
            'https://script.google.com/macros/s/AKfycbyE5a5-bHr3f2u6cq9TS8tajLeitD3qaRwM8XNocZK9ioqelvxienaE7r7OXXpn1U5d/exec?action=gifts'
        )
            .then((response) => response.json())
            .then((data) => {
                setReservedGifts(data.reservedGifts || [])
            })
            .catch((error) => {
                console.error('Ошибка загрузки подарков:', error)
            })
    }, [])

    const submitGuest = async () => {
        if (!guestName.trim()) {
            alert('Пожалуйста, введи своё имя')
            return
        }

        if (isSubmitting) {
            return
        }

        setIsSubmitting(true)

        const params = new URLSearchParams({
            name: guestName,
            food: foodPreferences.join(', '),
            customFood: customFood,
            foodRestrictions: foodRestrictions,
            drink: drinkPreferences.join(', '),
            alcohol: alcohol,
            drinkRestrictions: drinkRestrictions,
            gift: selectedGift ? String(selectedGift) : '',
        })

        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbyE5a5-bHr3f2u6cq9TS8tajLeitD3qaRwM8XNocZK9ioqelvxienaE7r7OXXpn1U5d/exec?${params.toString()}`
            )

            const result = await response.json()

            if (result.ok) {
                setScreen('finish')
                return
            }

            if (result.error === 'gift_already_reserved') {
                alert('К сожалению, этот подарок уже выбрал кто-то другой 🎁')

                const giftsResponse = await fetch(
                    'https://script.google.com/macros/s/AKfycbyE5a5-bHr3f2u6cq9TS8tajLeitD3qaRwM8XNocZK9ioqelvxienaE7r7OXXpn1U5d/exec?action=gifts'
                )

                const giftsData = await giftsResponse.json()

                setReservedGifts(giftsData.reservedGifts || [])
                setIsSubmitting(false)
                setScreen('wishlist')
            }
        } catch (error) {
            console.error('Ошибка отправки:', error)

            alert('Не удалось отправить ответ. Попробуй ещё раз.')
            setIsSubmitting(false)
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

    if (screen === 'food') {
        return (
            <main className="page">
                <section className="card">
                    <p className="eyebrow">ШАГ 1 ИЗ 3</p>

                    <h1>🍕 Еда</h1>

                    <p className="screen-description">
                        Что ты будешь есть?
                    </p>

                    <div className="options-grid">
                        {foodOptions.map((food) => (
                            <button
                                className={`option-button ${
                                    foodPreferences.includes(food)
                                        ? 'selected'
                                        : ''
                                }`}
                                key={food}
                                onClick={() => toggleFood(food)}
                            >
                                <span>{food}</span>

                                {foodPreferences.includes(food) && (
                                    <span className="check">✓</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="form-section">
                        <label htmlFor="custom-food">
                            Что-нибудь ещё?
                        </label>

                        <input
                            id="custom-food"
                            type="text"
                            placeholder="Например: паста"
                            value={customFood}
                            onChange={(event) =>
                                setCustomFood(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="food-restrictions">
                            Есть что-то, что ты не ешь?
                        </label>

                        <input
                            id="food-restrictions"
                            type="text"
                            placeholder="Например: орехи"
                            value={foodRestrictions}
                            onChange={(event) =>
                                setFoodRestrictions(event.target.value)
                            }
                        />
                    </div>

                    <div className="navigation-buttons">
                        <button
                            className="primary-button"
                            onClick={() => setScreen('drinks')}
                        >
                            Дальше →
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setScreen('welcome')}
                        >
                            ← Назад
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    if (screen === 'drinks') {
        return (
            <main className="page">
                <section className="card">
                    <p className="eyebrow">ШАГ 2 ИЗ 3</p>

                    <h1>🥤 Напитки</h1>

                    <p className="screen-description">
                        Что ты будешь пить?
                    </p>

                    <div className="options-grid">
                        {drinkOptions.map((drink) => (
                            <button
                                className={`option-button ${
                                    drinkPreferences.includes(drink)
                                        ? 'selected'
                                        : ''
                                }`}
                                key={drink}
                                onClick={() => toggleDrink(drink)}
                            >
                                <span>{drink}</span>

                                {drinkPreferences.includes(drink) && (
                                    <span className="check">✓</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="form-section">
                        <label>🍷 Будешь пить алкоголь?</label>

                        <div className="options-grid">
                            <button
                                className={`option-button ${
                                    alcohol === 'Да' ? 'selected' : ''
                                }`}
                                onClick={() => setAlcohol('Да')}
                            >
                                <span>Да</span>

                                {alcohol === 'Да' && (
                                    <span className="check">✓</span>
                                )}
                            </button>

                            <button
                                className={`option-button ${
                                    alcohol === 'Нет' ? 'selected' : ''
                                }`}
                                onClick={() => setAlcohol('Нет')}
                            >
                                <span>Нет</span>

                                {alcohol === 'Нет' && (
                                    <span className="check">✓</span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="form-section">
                        <label htmlFor="drink-restrictions">
                            🚫 Есть напитки, которые ты не пьёшь?
                        </label>

                        <input
                            id="drink-restrictions"
                            type="text"
                            placeholder="Например: кофе"
                            value={drinkRestrictions}
                            onChange={(event) =>
                                setDrinkRestrictions(event.target.value)
                            }
                        />
                    </div>

                    <div className="navigation-buttons">
                        <button
                            className="primary-button"
                            onClick={() => setScreen('wishlist')}
                            disabled={!alcohol}
                        >
                            Дальше →
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setScreen('food')}
                        >
                            ← Назад
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    if (screen === 'wishlist') {
        return (
            <main className="page">
                <section className="card wishlist-card">
                    <p className="eyebrow">ШАГ 3 ИЗ 3</p>

                    <h1>🎁 Вишлист</h1>

                    <p className="screen-description">
                        Если захочешь что-нибудь подарить,
                        вот мой небольшой список желаний.
                    </p>

                    <div className="wishlist">
                        {wishlistItems.map((item) => {
                            const isReserved = reservedGifts.includes(item.id)
                            const isSelected = selectedGift === item.id

                            return (
                                <div
                                    className={`gift-card ${
                                        isSelected ? 'selected' : ''
                                    } ${isReserved ? 'reserved' : ''}`}
                                    key={item.id}
                                >
                                    <div className="gift-info">
                                        <div className="gift-number">
                                            №{item.id}
                                        </div>

                                        <div>
                                            <h2>{item.title}</h2>

                                            <p>{item.description}</p>

                                            <span className="gift-price">
                                            ≈ {item.price} BYN
                                        </span>
                                        </div>
                                    </div>

                                    <div className="gift-actions">
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gift-link"
                                        >
                                            Посмотреть →
                                        </a>

                                        <button
                                            className={`gift-button ${
                                                isSelected ? 'selected' : ''
                                            }`}
                                            onClick={() =>
                                                setSelectedGift(item.id)
                                            }
                                            disabled={isReserved}
                                        >
                                            {isReserved
                                                ? '🎁 Уже выбран'
                                                : isSelected
                                                    ? '✓ Я выберу этот подарок'
                                                    : 'Я подарю это'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="navigation-buttons">
                        <button
                            className="primary-button"
                            onClick={submitGuest}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Отправляем...'
                                : 'Завершить →'}
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => setScreen('drinks')}
                        >
                            ← Назад
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    if (screen === 'finish') {
        return (
            <main className="page">
                <section className="card finish-card">
                    <div className="finish-icon">
                        💌
                    </div>

                    <h1>
                        Всё готово, {guestName}!
                    </h1>

                    <div className="finish-message">
                        <p>
                            Теперь осталось самое главное —
                        </p>

                        <strong>
                            прийти и хорошо провести время! 🎉
                        </strong>
                    </div>

                    <div className="finish-details">
                        <div>
                            <span>📅</span>
                            <p>26 сентября</p>
                        </div>

                        <div>
                            <span>🕐</span>
                            <p>17:00</p>
                        </div>

                        <div>
                            <span>📍</span>
                            <p>Гродно</p>
                        </div>
                    </div>

                    {selectedGift ? (
                        <div className="selected-gift">
                            🎁 Ты выбрал(а) подарок №{selectedGift}
                        </div>
                    ) : (
                        <div className="selected-gift">
                            🎁 Подарок не выбран
                        </div>
                    )}

                    <button
                        className="primary-button telegram-button"
                        onClick={() =>
                            window.open(
                                'https://t.me/+XkVCjp2GJ3E2ZWY6',
                                '_blank'
                            )
                        }
                    >
                        💬 Вступить в Telegram
                    </button>
                </section>
            </main>
        )
    }

    return (
        <main className="page">
            <section className="card welcome-card">
                <p className="eyebrow">ПРИГЛАШЕНИЕ</p>

                <h1>Ты приглашён!</h1>

                <p className="subtitle">
                    Буду рада видеть тебя на моём празднике 💌
                </p>

                <div className="event-info">
                    <div>
                        <span>📅</span>
                        <strong>26 сентября</strong>
                    </div>

                    <div>
                        <span>🕐</span>
                        <strong>17:00</strong>
                    </div>

                    <div>
                        <span>📍</span>
                        <strong>Гродно</strong>
                    </div>
                </div>

                <div className="form-section">
                    <label htmlFor="guest-name">
                        Как тебя зовут?
                    </label>

                    <input
                        id="guest-name"
                        type="text"
                        placeholder="Твоё имя"
                        value={guestName}
                        onChange={(event) =>
                            setGuestName(event.target.value)
                        }
                    />
                </div>

                <button
                    className="primary-button"
                    onClick={() => setScreen('food')}
                    disabled={!guestName.trim()}
                >
                    Открыть приглашение
                </button>
            </section>
        </main>
    )
}

export default App