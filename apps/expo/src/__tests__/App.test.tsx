import { cleanup, render, screen } from '@testing-library/react-native'

import Paragraph from '../conponents/atoms/Paragraph/Paragraph'

afterEach(cleanup)

test('renders correctly', () => {
  render(<Paragraph>Cilotta</Paragraph>)
  expect(screen.getByText('Cilotta')).toBeTruthy()
})
