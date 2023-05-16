import Paragraph from '@Components/atoms/Paragraph/Paragraph'
import { cleanup, render, screen } from '@testing-library/react-native'

afterEach(cleanup)

test('renders correctly', () => {
  render(<Paragraph>Cilotta</Paragraph>)
  expect(screen.getByText('Cilotta')).toBeTruthy()
})
