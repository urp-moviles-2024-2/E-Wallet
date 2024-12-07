import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, ChevronLeft } from 'lucide-react-native';
import PieChart from 'react-native-pie-chart';
import { startOfWeek, endOfWeek, parseISO, getDay, isSameWeek } from 'date-fns';

const StatisticScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [incomeByDay, setIncomeByDay] = useState({
        Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
    });
    const [expenseByDay, setExpenseByDay] = useState({
        Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
    });
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);
    const user = FIREBASE_AUTH.currentUser;

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
                    const pieData = processTransactions(userTransactions);
                    setPieChartData(pieData);
                    setTransactions(userTransactions);

                    let totalIncome = 0;
                    let totalExpense = 0;

                    const incomeByDayTemp = {
                        Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
                    };
                    const expenseByDayTemp = {
                        Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
                    };

                    userTransactions.forEach(transaction => {
                        const timestamp = transaction.timestamp;

                        const transactionDate = timestamp instanceof Date ? timestamp : timestamp.toDate();

                        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

                        if (isSameWeek(transactionDate, startOfThisWeek, { weekStartsOn: 1 })) {
                            const dayOfWeek = getDay(transactionDate);
                            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];

                            if (transaction.type === "Recibido") {
                                totalIncome += transaction.amount;
                                incomeByDayTemp[dayName] += transaction.amount;
                            } else if (transaction.type === "Enviado") {
                                totalExpense += transaction.amount;
                                expenseByDayTemp[dayName] += transaction.amount;
                            }
                        }
                    });

                    setIncome(totalIncome);
                    setExpense(totalExpense);
                    setIncomeByDay(incomeByDayTemp);
                    setExpenseByDay(expenseByDayTemp);
                }
            } catch (error) {
                console.error("Error al obtener las transacciones:", error);
                Alert.alert("Error", "Hubo un problema al cargar las transacciones.");
            }
        };

        fetchTransactions();
    }, [user]);

    const weeklyData = Object.keys(incomeByDay).map(day => ({
        day,
        income: incomeByDay[day],
        expense: expenseByDay[day],
    }));

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

    const processTransactions = (transactions) => {
        const filteredTransactions = transactions.filter(transaction => 
            transaction.type === "Enviado" && transaction.nombreProducto
        );

        console.log(filteredTransactions)

        const productCounts = filteredTransactions.reduce((acc, transaction) => {
            const product = transaction.nombreProducto;
            if (acc[product]) {
                acc[product] += 1;
            } else {
                acc[product] = 1;
            }
            return acc;
        }, {});

        const pieChartData = Object.keys(productCounts).map(product => ({
            name: product,
            value: productCounts[product],
            color: getRandomColor()
        }));

        console.log(pieChartData)

        return pieChartData;
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <ScrollView style={styles.container}>

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
            <Text style={styles.title}>Statistic Overview</Text>
            {renderBarChart()}
            <Text style={styles.title}>Category Chart</Text>
            {pieChartData.length > 0 ? (
                <View style={styles.chartContainer}>
                <PieChart
                    widthAndHeight={250}
                    series={pieChartData.map(item => item.value)}
                    sliceColor={pieChartData.map(item => item.color)}
                    coverRadius={0.5}
                    coverFill={'#FFF'}
                    style={styles.chart}
                />
                <View style={styles.legend}>
                    {pieChartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
            ) : (
                <Text>No hay transacciones para mostrar.</Text>
            )}
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
    statsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    chart: {
        marginBottom: 20,
    },
    legend: {
        marginTop: 20,
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    legendText: {
        marginLeft: 10,
    }
});

export default StatisticScreen;
