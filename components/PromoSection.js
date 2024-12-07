import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getColors } from "react-native-image-colors";

const PromoSection = ({ products }) => {
  const navigation = useNavigation();
  const [productColors, setProductColors] = useState({});

  // Función para obtener el color dominante de una imagen
  const getDominantColor = async (imageUri, productId) => {
    try {
      const colors = await getColors(imageUri, {
        fallback: "#000000", // Color por defecto si no se puede extraer
      });
      setProductColors((prevColors) => ({
        ...prevColors,
        [productId]: colors.dominant, // Almacena el color dominante por producto
      }));
    } catch (error) {
      console.error("Error al obtener colores", error);
      setProductColors((prevColors) => ({
        ...prevColors,
        [productId]: "#000000", // Color por defecto en caso de error
      }));
    }
  }; 

  const handleProductPress = (product) => {
    navigation.navigate("PaymentScreen", { product });
  };

  useEffect(() => {
    // Llamada para obtener el color dominante de cada imagen de los productos
    products.forEach((item) => {
      getDominantColor(item.imagen, item.id);
    });
  }, [products]);

  return (
    <View style={styles.promoSection}>
      <View style={styles.promoHeader}>
        <Text style={styles.sectionTitle}>Promo & Discount</Text>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={true} // Habilita el desplazamiento horizontal
        showsHorizontalScrollIndicator={false} // Oculta el indicador de scroll
        contentContainerStyle={styles.scrollContent} // Espaciado para los elementos
      >
        <View style={styles.promoCard}>
          <View style={styles.promoInformation}>
            <Text style={styles.promoTitle}>30% OFF</Text>
            <Text style={styles.promoSubtitle}>Black Friday deal</Text>
            <Text style={styles.promoDescription}>
              Get discount for every topup, transfer and payment
            </Text>
          </View>
          <View style={styles.containerPromoImage}>
            <Image
              source={require('../assets/imagen-promo.png')}
              style={styles.promoImage}
            />
          </View>
        </View>

        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.productCard, { backgroundColor: productColors[item.id] || '#f5f5f5' }]} // Usamos el color dominante o un color por defecto
            onPress={() => handleProductPress(item)}
          >
            <View style={styles.promoInformation}>
              <Text style={styles.promoTitle}>Price: S/ {item.precio}</Text>
              <Text style={styles.promoSubtitle}>{item.nombre}</Text>
              <Text style={styles.productQuantity}>Available: {item.cantidad} units</Text>
            </View>
            <View style={styles.containerPromoImage}>
              <Image
                source={{ uri: item.imagen }} // Cargar la imagen del producto
                style={styles.promoImage}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  promoHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeMore: {
    fontSize: 14,
    color: "#4cd080",
  },
  promoSection: {
    flex: 1,
    marginBottom: 60,
  },
  promoCard: {
    backgroundColor: '#064e3b',
    borderRadius: 16,
    padding: 16,
    height: 170,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 20,
    marginBottom: 16,
  },
  promoInformation: {
    width: 180,
  },
  promoTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
    marginBottom: 15,
  },
  promoDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#bdbdbd',
  },
  promoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  containerPromoImage: {
    width: 80,
    height: 80,
  },
  scrollContent: {
    paddingHorizontal: 8, // Espaciado lateral para los productos
  },
  productCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    height: 170,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 300,
    height: 170,
    alignItems: 'center',
    overflow: 'hidden',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 700,
    marginVertical: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#f5f5f5',
  },
});

export default PromoSection;
