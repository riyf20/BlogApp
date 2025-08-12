import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
	return (
		<PlatformPressable
			{...props}
			onPressIn={(ev) => {
				if (process.env.EXPO_OS === 'ios') {
					// Haptic feedback when pressing down on the tabs.
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				}
				props.onPressIn?.(ev);
			}}
		/>
	);
}
// Soft haptic feedback for buttons/components
export function useHapticFeedback() {
  return () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
}