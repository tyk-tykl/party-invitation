import { useState } from 'react'

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

function App() {
    const [screen, setScreen] = useState('welcome')
    const [direction, setDirection] = useState<'forward' | 'back'>('forward')

    const [guestName, setGuestName] = useState('')

    const [foodPreferences, setFoodPreferences] = useState<string[]>([])
    const [drinkPreferences, setDrinkPreferences] = useState<string[]>([])

    const [customFood, setCustomFood] = useState('')

    const [foodRestrictions, setFoodRestrictions] = useState('')
    const [drinkRestrictions, setDrinkRestrictions] = useState('')

    const [alcohol, setAlcohol] = useState('')

    const [bathhouse, setBathhouse] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)

    const goToScreen = (
        nextScreen: string,
        nextDirection: 'forward' | 'back'
    ) => {
        setDirection(nextDirection)
        setScreen(nextScreen)
    }

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
            bathhouse: bathhouse,
        })

        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbyhFSvqlf-YGNzMK7p0P8wF0rmyf8hl0KgbWGrcLACgISK6kqVFPIkpl4MYp2NyXkDQ/exec?${params.toString()}`
            )

            const result = await response.json()

            if (result.ok) {
                goToScreen('finish', 'forward')
            } else {
                alert('Не удалось отправить ответ. Попробуй ещё раз.')
                setIsSubmitting(false)
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
                            onClick={() => goToScreen('bathhouse', 'forward')}
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

    if (screen === 'bathhouse') {
        return (
            <div className={`page ${direction}`}>
                <main className="card">

                    <p className="eyebrow">
                        ЧАСТЬ 3 ИЗ 3
                    </p>

                    <h1>Баня</h1>

                    <div className="form-section">
                        <label>
                            Пойдёшь с нами в баню?
                        </label>

                        <div className="options-grid">

                            <button
                                className={`option-button ${
                                    bathhouse === 'Да' ? 'selected' : ''
                                }`}
                                onClick={() => setBathhouse('Да')}
                            >
                                <span>Да</span>

                                {bathhouse === 'Да' && (
                                    <span className="check">✓</span>
                                )}
                            </button>

                            <button
                                className={`option-button ${
                                    bathhouse === 'Нет' ? 'selected' : ''
                                }`}
                                onClick={() => setBathhouse('Нет')}
                            >
                                <span>Нет</span>

                                {bathhouse === 'Нет' && (
                                    <span className="check">✓</span>
                                )}
                            </button>

                        </div>
                    </div>

                    <div className="navigation-buttons">

                        <button
                            className="primary-button"
                            onClick={submitGuest}
                            disabled={!bathhouse || isSubmitting}
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
                        Всё готово!
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

                    <a
                        className="primary-button wishlist-button"
                        href="/party-invitation/wishlist.docx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🎁 Открыть вишлист
                    </a>

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