import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useApp } from '../context/AppContext';
import {
  Text,
  Card,
  Select,
  QuantityInput,
} from '../components';
import frostTheme from '../theme';

const themeOptions = [
  { value: 'light', label: 'Light', icon: 'light-mode' },
  { value: 'dark', label: 'Dark', icon: 'dark-mode' },
  { value: 'system', label: 'System', icon: 'settings-brightness' },
];

const sortOptions = [
  { value: 'name', label: 'Name', icon: 'sort-by-alpha' },
  { value: 'expiry', label: 'Expiry Date', icon: 'event' },
];

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp();

  const handleNotificationsChange = (enabled: boolean) => {
    updateSettings({
      ...settings,
      notificationsEnabled: enabled,
    });
  };

  const handleNotificationDaysChange = (days: number) => {
    updateSettings({
      ...settings,
      expiryNotificationDays: days,
    });
  };

  const handleSortOrderChange = (order: 'name' | 'expiry') => {
    updateSettings({
      ...settings,
      sortOrder: order,
    });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({
      ...settings,
      theme,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Notifications
        </Text>
        <Card>
          <View style={styles.settingRow}>
            <Text>Enable Notifications</Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleNotificationsChange}
            />
          </View>
          {settings.notificationsEnabled && (
            <View style={styles.settingRow}>
              <Text>Days before expiry</Text>
              <QuantityInput
                value={settings.expiryNotificationDays}
                onChange={handleNotificationDaysChange}
                min={1}
                max={30}
                style={styles.daysInput}
              />
            </View>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Display
        </Text>
        <Card>
          <View style={styles.settingRow}>
            <Text>Theme</Text>
            <Select
              value={settings.theme}
              options={themeOptions}
              onChange={handleThemeChange}
              style={styles.select}
            />
          </View>
          <View style={styles.settingRow}>
            <Text>Default Sort Order</Text>
            <Select
              value={settings.sortOrder}
              options={sortOptions}
              onChange={handleSortOrderChange}
              style={styles.select}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          About
        </Text>
        <Card>
          <View style={styles.aboutContent}>
            <Text variant="h3" style={styles.appName}>
              FridgeSmart
            </Text>
            <Text variant="body2" style={styles.version}>
              Version 1.0.0
            </Text>
            <Text variant="body1" style={styles.description}>
              Keep track of your food items and reduce waste with smart expiry notifications.
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  section: {
    padding: frostTheme.spacing.md,
  },
  sectionTitle: {
    marginBottom: frostTheme.spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: frostTheme.spacing.sm,
  },
  daysInput: {
    width: 120,
  },
  select: {
    width: 150,
  },
  aboutContent: {
    alignItems: 'center',
    padding: frostTheme.spacing.md,
  },
  appName: {
    color: frostTheme.colors.primary,
  },
  version: {
    color: frostTheme.colors.subtext,
    marginTop: frostTheme.spacing.xs,
  },
  description: {
    textAlign: 'center',
    marginTop: frostTheme.spacing.md,
  },
}); 