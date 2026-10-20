import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  GraduationCap,
  Music,
  Video,
  Disc3,
  User,
} from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';

export interface FloatingTabBarProps {
  state: any;
  descriptors: any;
  navigation?: any;
  navigateToTab?: (routeKey: string) => void;
  insets?: any;
}

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? Colors.gold : 'rgba(245, 239, 230, 0.45)';
    const size = isFocused ? 21 : 19;

    switch (routeName) {
      case 'index':
        return <GraduationCap size={size} color={color} />;
      case 'practice':
        return <Music size={size} color={color} />;
      case 'masterclass':
        return <Video size={size} color={color} />;
      case 'repertoire':
        return <Disc3 size={size} color={color} />;
      case 'profile':
        return <User size={size} color={color} />;
      default:
        return <GraduationCap size={size} color={color} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Gurukul';
      case 'practice':
        return 'Riyaz';
      case 'masterclass':
        return '1-on-1';
      case 'repertoire':
        return 'Archive';
      case 'profile':
        return 'Disciple';
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.pillCard}>
        {/* Apple Hardware-Accelerated Frosted Glass Layer */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 75 : 60}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        {/* Tab Items Row */}
        <View style={styles.tabsRow}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabButton}
              >
                <View style={styles.iconWrapper}>
                  {getTabIcon(route.name, isFocused)}
                  {isFocused && <View style={styles.activeDot} />}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? Colors.gold : 'rgba(245, 239, 230, 0.45)',
                      fontFamily: isFocused ? Fonts.sansBold : Fonts.sansRegular,
                    },
                  ]}
                >
                  {getTabLabel(route.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 99,
  },
  pillCard: {
    width: '100%',
    maxWidth: 500,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 18, 19, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.32)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 26,
  },
  activeDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gold,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
