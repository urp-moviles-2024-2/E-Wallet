import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Settings, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const StatisticScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
    const user = FIREBASE_AUTH.currentUser;
    const navigation = useNavigation();

    // Datos simulados para el gráfico de barras
    const weeklyData = [
        { day: 'Mon', income: 800, expense: 400 },
        { day: 'Tue', income: 1200, expense: 300 },
        { day: 'Wed', income: 600, expense: 200 },
        { day: 'Thu', income: 900, expense: 500 },
        { day: 'Fri', income: 1100, expense: 300 },
        { day: 'Sat', income: 700, expense: 400 },
        { day: 'Sun', income: 500, expense: 200 },
    ];

    // Datos simulados para gastos recientes
    const recentExpenses = [
        {
            id: 1,
            name: 'Starbucks Coffee',
            date: 'Dec 2, 2020',
            time: '3:09 PM',
            amount: 156.00,
            icon: '☕'
        },
        {
            id: 2,
            name: 'Netflix Subscription',
            date: 'Dec 2, 2020',
            time: '3:09 PM',
            amount: 87.00,
            icon: '🎬'
        }
    ];

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                if (!user) {
                    Alert.alert("Error", "No se pudo autenticar al usuario.");
                    return;
                }

                const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    const userTransactions = userData.transacciones || [];
                    setTransactions(userTransactions);

                    let totalIncome = 0;
                    let totalExpense = 0;

                    userTransactions.forEach(transaction => {
                        if (transaction.type === "Recibido") {
                            totalIncome += transaction.amount;
                        } else if (transaction.type === "Enviado") {
                            totalExpense += transaction.amount;
                        }
                    });

                    setIncome(totalIncome);
                    setExpense(totalExpense);
                }
            } catch (error) {
                console.error("Error al obtener las transacciones:", error);
                Alert.alert("Error", "Hubo un problema al cargar las transacciones.");
            }
        };

        fetchTransactions();
    }, [user]);

    const renderBarChart = () => (
        <View style={styles.barChartContainer}>
            {weeklyData.map((data, index) => (
                <View key={index} style={styles.barGroup}>
                    <View style={styles.bars}>
                        <View style={[styles.bar, styles.incomeBar, { height: data.income / 20 }]} />
                        <View style={[styles.bar, styles.expenseBar, { height: data.expense / 20 }]} />
                    </View>
                    <Text style={styles.barLabel}>{data.day}</Text>
                </View>
            ))}
        </View>
    );

    const renderCategoryChart = () => (
        <View style={styles.categoryChartContainer}>
            <Text style={styles.sectionTitle}>Category Chart</Text>
            <Text style={styles.subTitle}>Last 7 days expenses</Text>
            <View style={styles.donutChart}>
                {/* Placeholder for donut chart - you might want to use a library like react-native-svg-charts */}
                <View style={styles.donutPlaceholder}>
                    <Text style={styles.donutTotal}>~$312.00</Text>
                </View>
            </View>
            <View style={styles.categoryLegend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
                    <Text style={styles.legendText}>Transportation</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#105D38' }]} />
                    <Text style={styles.legendText}>Shopping</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#228B22' }]} />
                    <Text style={styles.legendText}>Coffee</Text>
                </View>
            </View>
        </View>
    );

    const renderRecentExpenses = () => (
        <View style={styles.recentExpensesContainer}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            {recentExpenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                    <View style={styles.expenseIcon}>
                        <Text style={styles.iconText}>{expense.icon}</Text>
                    </View>
                    <View style={styles.expenseInfo}>
                        <Text style={styles.expenseName}>{expense.name}</Text>
                        <Text style={styles.expenseDate}>{expense.date} • {expense.time}</Text>
                    </View>
                    <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft style={styles.button} color={'#030319'} />
                </TouchableOpacity>
                <Text style={styles.title}>Statistic</Text>
                <TouchableOpacity>
                    <Settings style={styles.button} color={'#030319'} />
                </TouchableOpacity>
            </View>

            <View style={styles.incomeExpense}>
                <View style={styles.elements}>
                    <Text style={styles.titleElement}>Income</Text>
                    <Text style={styles.cashElement}>${income.toLocaleString()}</Text>
                </View>
                <View style={styles.elements}>
                    <Text style={styles.titleElement}>Expense</Text>
                    <Text style={styles.cashElement}>${expense.toLocaleString()}</Text>
                </View>
            </View>

            <View style={styles.periodSelector}>
                <TouchableOpacity 
                    style={[styles.periodButton, selectedPeriod === 'Weekly' && styles.selectedPeriod]}
                    onPress={() => setSelectedPeriod('Weekly')}
                >
                    <Text style={styles.periodText}>Weekly</Text>
                </TouchableOpacity>
            </View>

            {renderBarChart()}
            {renderCategoryChart()}
            {renderRecentExpenses()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
        paddingHorizontal: 20,
        paddingTop: 20,
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
        color: '#030319'
    },
    incomeExpense: {
        width: "90%",
        height: 90,
        borderRadius: 16,
        backgroundColor: "#105D38",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 20,
    },
    titleElement: {
        fontSize: 14,
        color: "#E0E0E0",
        fontWeight: "400",
        textAlign: "center"
    },
    cashElement: {
        fontSize: 24,
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center"
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    periodButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
    },
    selectedPeriod: {
        backgroundColor: '#F0F0F0',
    },
    periodText: {
        color: '#030319',
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 200,
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    barGroup: {
        alignItems: 'center',
    },
    bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bar: {
        width: 8,
        marginHorizontal: 2,
        borderRadius: 4,
    },
    incomeBar: {
        backgroundColor: '#105D38',
    },
    expenseBar: {
        backgroundColor: '#FFA500',
    },
    barLabel: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
    categoryChartContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#030319',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    donutChart: {
        alignItems: 'center',
        marginVertical: 20,
    },
    donutPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 20,
        borderColor: '#105D38',
        justifyContent: 'center',
        alignItems: 'center',
    },
    donutTotal: {
        fontSize: 20,
        fontWeight: '600',
    },
    categoryLegend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
    },
    recentExpensesContainer: {
        padding: 20,
    },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    expenseIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#105D38',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconText: {
        fontSize: 20,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#030319',
    },
    expenseDate: {
        fontSize: 12,
        color: '#666',
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#030319',
    },
});

export default StatisticScreen;