import React from 'react'
import type { TextProps } from 'react-native'
import { Text } from 'react-native'

const Paragraph = ({ children, ...props }: TextProps) => (
  <Text
    {...props}
    className='my-2 text-sm text-black'>
    {children}
  </Text>
)

export default Paragraph
