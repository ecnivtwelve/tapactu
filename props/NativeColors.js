import {
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

const UITheme = (scheme) => {
  const dark = scheme === 'dark';
  const BaseTheme = dark ? DarkTheme : DefaultTheme;

  return {
    ...BaseTheme,
    dark : dark,
    colors: {
      ...BaseTheme.colors,
      primary: dark ? '#0A84FF' : '#007AFF',
      background: dark ? '#000000' : '#F2F2F7',
      card: dark ? '#1C1C1E' : '#FFFFFF',
      text: dark ? '#FFFFFF' : '#000000',
      border: dark ? '#38383A' : '#C6C6C8',
      notification: dark ? '#FF453A' : '#FF3B30',
    },
  }
};

export default UITheme;