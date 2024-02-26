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
      primary: dark ? '#FFFFFF' : '#000000',
      background: dark ? '#000000' : '#F4F4F4',
      card: dark ? '#1C1C1E' : '#FFFFFF',
      text: dark ? '#FFFFFF' : '#000000',
      inactiveText: dark ? '#8E8E93' : '#8E8E93',
      border: dark ? '#38383A' : '#C6C6C8',
      notification: dark ? '#FF453A' : '#FF3B30',
    },
  }
};

export default UITheme;