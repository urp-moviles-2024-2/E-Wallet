// src/components/HomeHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings, ChevronLeft } from 'lucide-react-native';

const NotificationHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity>
                <ChevronLeft style={styles.button} />
            </TouchableOpacity>
            <Text style={styles.title}>Notification</Text>
            <TouchableOpacity>
                <Settings style={styles.button} />
            </TouchableOpacity>
        </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
    },
    button: {
        size: 24,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#e6e6e8',
        borderRadius: 12,
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff'
    },
});

export default NotificationHeader;