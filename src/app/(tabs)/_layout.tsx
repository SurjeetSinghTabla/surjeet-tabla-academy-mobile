import React from 'react';
import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/layout/FloatingTabBar';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.obsidian },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gurukul',
        }}
      />
      <Tabs.Screen
        name="masterclass"
        options={{
          title: '1-on-1',
        }}
      />
      <Tabs.Screen
        name="repertoire"
        options={{
          title: 'Archive',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Disciple',
        }}
      />
    </Tabs>
  );
}
