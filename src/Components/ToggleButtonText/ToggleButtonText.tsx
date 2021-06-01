import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import color from 'color';
import {Button, IconButton, withTheme } from 'react-native-paper'

import { ToggleButtonGroupContext } from 'react-native-paper/src/components/ToggleButton/ToggleButtonGroup';
import { black, white } from 'react-native-paper/src/styles/colors';
import type { IconSource } from 'react-native-paper/src/components/Icon';

type Props = {
    children: React.ReactNode;
    icon?: IconSource;
    size?: number;
    color?: string;
    disabled?: boolean;
    accessibilityLabel?: string;
    onPress?: (value?: GestureResponderEvent | string) => void;
    value?: string;
    status?: 'checked' | 'unchecked';
    style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

const ToggleButtonText = ({
    children,
    icon,
    size,
    theme,
    accessibilityLabel,
    disabled,
    style,
    value,
    status,
    onPress,
    ...rest
}: Props) => {

    return (
        <ToggleButtonGroupContext.Consumer>
            {(context: { value: string | null; onValueChange: Function } | null) => {

            const checked: boolean | null =
                (context && context.value === value) || status === 'checked';

            return (
                
            <Button
                icon={icon}
                onPress={(e?: GestureResponderEvent | string) => {
                if (onPress) {
                    onPress(e);
                }

                if (context) {
                    context.onValueChange(!checked ? value : null);
                }
                }}
                mode={checked ? 'contained':'text'}
                accessibilityLabel={accessibilityLabel}
                accessibilityState={{ disabled, selected: checked }}
                disabled={disabled}
                
                style={[
                styles.content,
                style,
                ]}
                {...rest}>
            {children}
            </Button>
            );
        }}
        </ToggleButtonGroupContext.Consumer>
    );
};

const styles = StyleSheet.create({
  content: {
    width: 42,
    height: 42,
    margin: 0,
  },
});

export default withTheme(ToggleButtonText);

// @component-docs ignore-next-line
const ToggleButtonWithTheme = withTheme(ToggleButtonText);
// @component-docs ignore-next-line
export { ToggleButtonWithTheme as ToggleButtonText };