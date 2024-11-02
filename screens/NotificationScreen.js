// src/screens/NotificationScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import NotificationHeader from '../components/NotificationHeader';
import NotificationItem from '../components/NotificationItem';

const NotificationScreen = ({ notifications = {} }) => {
    const renderNotificationItem = ({ item }) => (
        <NotificationItem notification={item} />
    );

    return (
        <View style={styles.background}>
            <NotificationHeader />
            <View style={styles.notificationSection}>
                <Text style={styles.sectionTitle}>TODAY</Text>
                <FlatList
                    data={notifications.today}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text>No notifications for today.</Text>}
                />
                <Text style={styles.sectionTitle}>YESTERDAY</Text>
                <FlatList
                    data={notifications.yesterday}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text>No notifications for yesterday.</Text>}
                />
                <Text style={styles.sectionTitle}>LAST 7 DAYS</Text>
                <FlatList
                    data={notifications.last7Days}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text>No notifications in the last 7 days.</Text>}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'green',
        flex: 1,
    },
    notificationSection: {
        backgroundColor: '#fff',
        borderRadius: 25,
        marginTop: 8,
        padding: 10,
        paddingTop: 30,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        
    },
});

export default NotificationScreen;
