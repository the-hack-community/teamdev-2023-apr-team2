import { cleanup, render, screen } from '@testing-library/react-native'

import App from '../app/app'

afterEach(cleanup)

test('renders correctly', () => {
  render(<App />)
  expect(screen.getByText('Cilotta')).toBeTruthy()
})
