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

            <br />
            <br />

            <button onClick={() => setScreen('welcome')}>
                ← Назад
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

                <p>🍷 Будешь пить алкоголь?</p>

                <button onClick={() => setAlcohol('Да')}>
                    Да {alcohol === 'Да' ? '✓' : ''}
                </button>

                <button onClick={() => setAlcohol('Нет')}>
                    Нет {alcohol === 'Нет' ? '✓' : ''}
                </button>

                <p>🚫 Есть напитки, которые ты не пьёшь?</p>

                <input
                    type="text"
                    placeholder="Например: кофе"
                    value={drinkRestrictions}
                    onChange={(event) =>
                        setDrinkRestrictions(event.target.value)
                    }
                />

                <br />
                <br />

                <button
                    onClick={() => setScreen('wishlist')}
                    disabled={!alcohol}
                >
                    Дальше →
                </button>

                <br />
                <br />

                <button onClick={() => setScreen('food')}>
                    ← Назад
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
                        <br />

                        <button
                            onClick={() => setSelectedGift(item.id)}
                            disabled={reservedGifts.includes(item.id)}
                        >
                            {reservedGifts.includes(item.id)
                                ? '🎁 Уже выбран'
                                : selectedGift === item.id
                                    ? '✓ Я выберу этот подарок'
                                    : 'Я подарю это'}
                        </button>

                        <hr />
                    </div>
                ))}

                <button
                    onClick={submitGuest}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Отправляем...' : 'Завершить →'}
                </button>

                <br />
                <br />

                <button onClick={() => setScreen('drinks')}>
                    ← Назад
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

            <p>📅 26 сентября</p>
            <p>🕐 17:00</p>
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