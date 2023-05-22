import { API_BASE_URL } from '@Const/const'
import type { History } from '@Type/type'

export const getHistories = async ({
  token,
  csrfToken,
}: {
  token: string
  csrfToken: string
}): Promise<History[]> => {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Csrf-Token': csrfToken,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error(response.statusText)
  return (await response.json()) as History[]
}
