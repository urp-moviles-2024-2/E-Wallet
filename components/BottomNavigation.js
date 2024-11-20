import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, BarChart2, User, Scan, Bell } from 'lucide-react-native';

const BottomNavigation = ({ navigation }) => (
    <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Home size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Statistics')}>
            <BarChart2 size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.scanContainer}>
            <TouchableOpacity style={styles.scan} onPress={() => navigation.navigate('Scan')}>
                <Scan size={28} color="#fff" />
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
            <Bell size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <User size={24} color="#666" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
    },
    scanContainer: {
        position: 'relative',
        top: -40,
        zIndex: 1,
    },
    scan: {
        backgroundColor: '#ffaf59',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
    },
});

export default BottomNavigation;
