const KEY = 'sortmyprep_user_email'

export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY)
}

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzS5vGIU_22mNIPSJH3Js5mhlHZhKlAgomjARADwbpJOYlEsVVl2ky4JBB2S-ThKOiKhw/exec'

export function trackResult(data: {
  board: string
  score: string
  university: string
  course: string
  verdict: string
}): void {
  if (typeof window === 'undefined') return
  const email = getStoredEmail() ?? ''
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      timestamp:  new Date().toISOString(),
      email,
      board:      data.board,
      score:      data.score,
      university: data.university,
      course:     data.course,
      verdict:    data.verdict,
      source:     email ? 'result-known' : 'result-anon',
    }),
  }).catch(() => {})
}

export function storeEmail(
  email: string,
  data?: { board?: string; score?: string; university?: string; course?: string; verdict?: string },
): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, email)
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      email,
      timestamp:  new Date().toISOString(),
      source:     'grade-calc',
      board:      data?.board      ?? '',
      score:      data?.score      ?? '',
      university: data?.university ?? '',
      course:     data?.course     ?? '',
      verdict:    data?.verdict    ?? '',
    }),
  }).catch(() => {})
}
