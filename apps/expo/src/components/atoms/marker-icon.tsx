import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

const markerIcon = (props: SvgProps) => (
  <Svg
    fill='none'
    {...props}>
    <Path
      stroke='#FA8C61'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21 10.8C21 19.2 11 29 11 29S1 19.2 1 10.8C1 5.382 5.471 1 11 1s10 4.382 10 9.8Z'
    />
    <Path
      stroke='#FA8C61'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11 16.4c3.156 0 5.714-2.507 5.714-5.6 0-3.093-2.558-5.6-5.714-5.6-3.156 0-5.714 2.507-5.714 5.6 0 3.093 2.558 5.6 5.714 5.6Z'
    />
    <Path
      stroke='#FA8C61'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11 12.2c.789 0 1.429-.627 1.429-1.4 0-.773-.64-1.4-1.429-1.4s-1.429.627-1.429 1.4c0 .773.64 1.4 1.429 1.4Z'
    />
  </Svg>
)
export default markerIcon
