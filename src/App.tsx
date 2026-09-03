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
    const [direction, setDirection] = useState<'forward' | 'back'>('forward')

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

    const goToScreen = (
        nextScreen: string,
        nextDirection: 'forward' | 'back'
    ) => {
        setDirection(nextDirection)
        setScreen(nextScreen)
    }

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
                goToScreen('finish', 'forward')
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
            <div className={`page ${direction}`}>
                <main className="card">

                    <p className="eyebrow">
                        ЧАСТЬ 1 ИЗ 3
                    </p>

                    <h1>Еда</h1>

                    <div className="form-section">
                        <label>
                            Что будешь есть?
                        </label>

                        <div className="options-grid">
                            {foodOptions.map((food) => (
                                <button
                                    key={food}
                                    className={`option-button ${
                                        foodPreferences.includes(food)
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() => toggleFood(food)}
                                >
                                    <span>{food}</span>

                                    {foodPreferences.includes(food) && (
                                        <span className="check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <label>
                            Что-нибудь ещё?
                        </label>

                        <input
                            type="text"
                            placeholder="Например: паста"
                            value={customFood}
                            onChange={(event) =>
                                setCustomFood(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-section">
                        <label>
                            Есть что-то, что ты не ешь?
                        </label>

                        <input
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
                            onClick={() => goToScreen('drinks', 'forward')}
                        >
                            Дальше →
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => goToScreen('welcome', 'back')}
                        >
                            ← Назад
                        </button>

                    </div>

                </main>
            </div>
        )
    }

    if (screen === 'drinks') {
        return (
            <div className={`page ${direction}`}>
                <main className="card">

                    <p className="eyebrow">
                        ЧАСТЬ 2 ИЗ 3
                    </p>

                    <h1>Напитки</h1>

                    <div className="form-section">
                        <label>
                            Что будешь пить?
                        </label>

                        <div className="options-grid">
                            {drinkOptions.map((drink) => (
                                <button
                                    key={drink}
                                    className={`option-button ${
                                        drinkPreferences.includes(drink)
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() => toggleDrink(drink)}
                                >
                                    <span>{drink}</span>

                                    {drinkPreferences.includes(drink) && (
                                        <span className="check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <label>
                            🍷 Будешь пить алкоголь?
                        </label>

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
                        <label>
                            Есть напитки, которые ты не пьёшь?
                        </label>

                        <input
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
                            onClick={() => goToScreen('wishlist', 'forward')}
                            disabled={!alcohol}
                        >
                            Дальше →
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => goToScreen('food', 'back')}
                        >
                            ← Назад
                        </button>

                    </div>

                </main>
            </div>
        )
    }

    if (screen === 'wishlist') {
        return (
            <div className={`page ${direction}`}>
                <main className="card wishlist-card">

                    <p className="eyebrow">
                        ПОСЛЕДНИЙ ШАГ
                    </p>

                    <h1>Вишлист</h1>

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
                                    key={item.id}
                                    className={`gift-card ${
                                        isReserved ? 'reserved' : ''
                                    } ${
                                        isSelected ? 'selected' : ''
                                    }`}
                                >

                                    <div className="gift-info">

                                        <div className="gift-number">
                                            #{item.id}
                                        </div>

                                        <div>
                                            <h2>{item.title}</h2>

                                            <p>
                                                {item.description}
                                            </p>

                                            <span className="gift-price">
                                            ≈ {item.price} BYN
                                        </span>
                                        </div>

                                    </div>

                                    <div className="gift-actions">

                                        <a
                                            className="gift-link"
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
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
                                                    ? '✓ Выбран'
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
                            onClick={() => goToScreen('drinks', 'back')}
                        >
                            ← Назад
                        </button>

                    </div>

                </main>
            </div>
        )
    }

    if (screen === 'finish') {
        return (
            <div className={`page ${direction}`}>
                <main className="card finish-card">

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
                            прийти и хорошо провести время! ❤️
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

                    <div className="selected-gift">
                        {selectedGift ? (
                            <>
                                🎁 Ты выбрал(а) подарок №{selectedGift}
                            </>
                        ) : (
                            <>
                                🎁 Подарок не выбран
                            </>
                        )}
                    </div>

                    <button
                        className="primary-button telegram-button"
                        onClick={() =>
                            window.open(
                                'https://t.me/+XkVCjp2GJ3E2ZWY6',
                                '_blank'
                            )
                        }
                    >
                        💬 Вступить в Telegram-группу
                    </button>

                </main>
            </div>
        )
    }

    return (
        <div className={`page ${direction}`}>
            <main className="card welcome-card">

                <p className="eyebrow">
                    ПРИГЛАШЕНИЕ
                </p>

                <h1>
                    Hi, bro!
                </h1>

                <p className="subtitle">
                    Буду рада видеть тебя на нашем междусобойчике)
                </p>

                <div className="finish-details">

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

                    <label>
                        Обозначь себя:
                    </label>

                    <input
                        type="text"
                        placeholder="Твоё имя"
                        value={guestName}
                        onChange={(event) =>
                            setGuestName(event.target.value)
                        }
                    />

                </div>

                <div className="navigation-buttons">

                    <button
                        className="primary-button"
                        onClick={() => goToScreen('food', 'forward')}
                        disabled={!guestName.trim()}
                    >
                        Открыть приглашение →
                    </button>

                </div>

            </main>
        </div>
    )
}

export default App