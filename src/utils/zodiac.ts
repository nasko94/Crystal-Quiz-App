export const getZodiacSign = (date: string): string => {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен ♈'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец ♉'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнаци ♊'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак ♋'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лъв ♌'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева ♍'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Везни ♎'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион ♏'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец ♐'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козирог ♑'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей ♒'
  return 'Риби ♓'
}

export const getHappinessMessage = (level: number): string => {
  if (level <= 4) {
    return 'Съжалявам да го чуя! Но не се притеснявай - със сигурност ще ти намерим подходящ кристал за теб!'
  }
  if (level <= 7) {
    return 'Ясно. И по-добре си бил. Добрата новина е, че със сигурност имаме кристал да те вдигне до 9-10!'
  }
  return 'Отлично! Изглежда, че ще сте на една вибрация с нашите кристали!'
}

export const getNeedsLabel = (needs: string): string => {
  const labels: Record<string, string> = {
    time: 'Повече Време и Свобода',
    money: 'Повече Пари и Възможности',
    protection: 'Повече Защита и Спокойствие',
    health: 'Повече Здраве и Благополучие',
  }
  return labels[needs] || needs
}

export const getAchievementLabel = (achievement: string): string => {
  const labels: Record<string, string> = {
    recent: 'Съвсем наскоро',
    '1year': 'Преди година',
    '3years': 'Преди 3 години',
    '5years': 'Преди 5 години',
  }
  return labels[achievement] || achievement
}

export const getHappinessLabel = (level: number): string => {
  const labels: Record<number, string> = {
    0: 'Много нещастен',
    1: 'Нещастен',
    2: 'Тъжен',
    3: 'Разстроен',
    4: 'Неутрален',
    5: 'Добре',
    6: 'Доволен',
    7: 'Щастлив',
    8: 'Много щастлив',
    9: 'Еуфоричен',
    10: 'Нирвана',
  }
  return labels[level] || `Ниво ${level}`
}

