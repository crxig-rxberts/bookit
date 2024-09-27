import {Platform} from 'react-native';

const iosFonts = {
  regular: 'Helvetica',
  medium: 'Helvetica-Bold',
  light: 'Helvetica-Light',
  thin: 'Helvetica-Thin',
  monospace: 'Courier',
};

const androidFonts = {
  regular: 'Roboto',
  medium: 'Roboto-Medium',
  light: 'Roboto-Light',
  thin: 'Roboto-Thin',
  monospace: 'Courier-Oblique',
};

export const fonts = Platform.select({
  ios: iosFonts,
  android: androidFonts,
});

export const fontSizes = {
  small: 12,
  regular: 16,
  mid: 18,
  large: 20,
  extraLarge: 28,
};

export const fontStyles = {
  title: {
    fontFamily: fonts.monospace,
    fontSize: fontSizes.extraLarge,
    ...(Platform.OS === 'android' ? {fontStyle: 'italic'} : {}),
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.large,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.regular,
  },
  caption: {
    fontFamily: fonts.light,
    fontSize: fontSizes.small,
  },
};
