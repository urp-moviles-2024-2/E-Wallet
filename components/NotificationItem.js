import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const NotificationItem = () => (
    <View style={styles.notificationSection}>
        <View style={styles.notification}>
            <Image src="" style={styles.notificationImg}></Image>
            <Text style={styles.notificationTitle}>30% OFF</Text>
            <Text style={styles.notificationSubtitle}>Black Friday deal</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    notificationSection: {
        flex: 1,
    },
    notification: {
        backgroundColor: '#064e3b',
        borderRadius: 16,
        padding: 16,
        height: 120,
    },
    notificationTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    notificationSubtitle: {
        color: 'white',
        marginTop: 8,
    },
});

export default NotificationItem;