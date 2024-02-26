import * as React from 'react';

import { View, StyleSheet, Platform, Text } from 'react-native';

import { Cell, Section, TableView } from 'react-native-tableview-simple';

import { useTheme } from '@react-navigation/native';

function NativeList(props) {
  const { 
    children,
    inset,
    header,
    footer,
    style,
    tableViewProps,
    sectionProps,
  } = props;
  const { colors } = useTheme();

  // Automatically assign unique keys to children
  const childrenWithKeys = React.Children.map(children, (child, index) => {
    // remove null/undefined children
    if (!child) {
      return null;
    }

    // Check if this is the last child and add last={true} prop if it is
    const isLastChild = index === React.Children.count(children) - 1;
    return React.cloneElement(child, { key: `child-${index}`, last: isLastChild });
  });

  return (
    <TableView
      {...tableViewProps}
      appearance="auto"
      style={[
        style,
        inset ? {marginHorizontal: 15} : null,
        tableViewProps?.style,
      ]}
    >
      <Section
        {...sectionProps}
        header={header ? header : null}
        footer={footer ? footer : null}

        roundedCorners={sectionProps?.roundedCorners ? sectionProps.roundedCorners : inset ? true : false}
        hideSurroundingSeparators={sectionProps?.hideSurroundingSeparators ? sectionProps.hideSurroundingSeparators : inset ? true : false}
        separatorTintColor={sectionProps?.separatorTintColor ? sectionProps.separatorTintColor : colors.border}

        hideSeparator={sectionProps?.hideSeparator ? sectionProps.hideSeparator : false}

        headerTextStyle={[{
          color: colors.text,
          fontSize: 13,
          fontWeight: '400',
          opacity: 0.4,
          textTransform: 'uppercase',
          marginBottom: 2,
        }, sectionProps?.headerTextStyle]}
      >
        {childrenWithKeys}
      </Section>
    </TableView>
  );
}

function NativeItem(props) {
  const { 
    children,
    leading,
    trailing,
    onPress,
    chevron,
    cellProps,
    style,
    backgroundColor,
  } = props;

  const { colors } = useTheme();

  return (
    <Cell
      {...cellProps}

      cellImageView={ leading &&
        <View style={styles.cellImageView}>
          {leading}
        </View>
      }
      cellContentView={ children &&
        <View style={styles.cellContentView}>
          {children}
        </View>
      }
      cellAccessoryView={ trailing || chevron &&
        <View style={styles.cellAccessoryView}>
          {trailing}
        </View>
      }

      backgroundColor={!backgroundColor ? colors.card : backgroundColor}

      onPress={onPress}
    />
  );
}

function NativeText(props) {
  const {
    children,
    heading = 'p',
    style,
    numberOfLines,
    textProps,
  } = props;

  const { colors } = useTheme();

  const headingStyles = {
    "h1": {
      fontSize: 24,
      fontWeight: 600,
    },
    "h2": {
      fontSize: 19,
      fontWeight: 600,
    },
    "h3": {
      fontSize: 18,
      fontWeight: 600,
    },
    "h4": {
      fontSize: 16,
      fontWeight: 600,
    },
    "subtitle1": {
      fontSize: 13,
      fontWeight: 500,
      opacity: 0.6,
    },
    "subtitle2": {
      fontSize: 13,
      fontWeight: 400,
      opacity: 0.6,
    },
    "subtitle3": {
      fontSize: 13,
      fontWeight: 400,
      opacity: 0.6,
      letterSpacing: 0.7,
      textTransform: 'uppercase',
    },
    "p": {
      fontSize: 16.5,
    },
    "p2": {
      fontSize: 16,
      opacity: 0.6,
    },
    "b": {
      fontSize: 16,
      fontWeight: '600',
    },
  };

  return (
    <Text
      {...textProps}
      style={[
        {
          color: colors.text,
        },
        headingStyles[heading],
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode='tail'
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  cellImageView: {
    marginRight: 14,
  },
  cellContentView: {
    flex: 1,
    paddingVertical: 9,
    gap: 2,
  },
  cellAccessoryView: {
    marginLeft: 14,
  },
})

export { NativeList, NativeItem, NativeText };
