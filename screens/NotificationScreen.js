import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Gift, Info, Percent } from 'lucide-react-native';
import NotificationHeader from '../components/NotificationHeader';
import NotificationSection from '../components/NotificationSection';
import NotificationItem from '../components/NotificationItem';

const NotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationHeader navigation={navigation} />
      <TouchableOpacity style={styles.markAllButton}>
        <Text style={styles.markAllText}>Mark as read</Text>
      </TouchableOpacity>
      <ScrollView>
        <NotificationSection title="TODAY">
          <NotificationItem
            icon={Percent}
            title="Cashback 50%"
            subtitle="Get 50% cashback for the next top up"
            time="Top up now >"
            type="Promo"
          />
        </NotificationSection>

        <NotificationSection title="YESTERDAY">
          <NotificationItem
            icon={Gift}
            title="Daily Cashback"
            subtitle="8:00 AM"
            type="Promo"
          />
          <NotificationItem
            icon={Gift}
            title="Use BLCK10 Promo Code"
            subtitle="3:40 PM"
            type="Promo"
          />
          <NotificationItem
            icon={Gift}
            title="Cyber Monday Deal"
            subtitle="10:39 AM"
            type="Promo"
          />
          <NotificationItem
            icon={Info}
            title="$250 top up successfully added"
            subtitle="8:14 PM"
            type="Info"
          />
        </NotificationSection>

        <NotificationSection title="LAST 7 DAY">
          <NotificationItem
            icon={Gift}
            title="Use NOV10 Promo Code"
            subtitle="3:40 PM"
            type="Promo"
          />
          <NotificationItem
            icon={Percent}
            title="30% Black Friday Deal"
            subtitle="Limited time offer!"
            type="Promo"
          />
        </NotificationSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  markAllButton: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  markAllText: {
    color: '#22c55e',
    fontSize: 14,
  },
});

export default NotificationScreen;