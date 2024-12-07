// src/components/HomeHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Settings, ChevronLeft } from 'lucide-react-native';

const NotificationHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeft style={styles.button} color={'#fff'} />
            </TouchableOpacity>
            <Text style={styles.title}>Notification</Text>
            <TouchableOpacity>
                <Settings style={styles.button} color={'#fff'} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#105D38',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 150,
        paddingHorizontal: 30,

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