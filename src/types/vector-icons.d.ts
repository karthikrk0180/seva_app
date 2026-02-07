declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';
  export default class MaterialIcons extends Component<TextProps & { name: string; size?: number; color?: string }> {}
}
