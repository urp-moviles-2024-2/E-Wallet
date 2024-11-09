import { doc, getDoc, setDoc, collection, addDoc, increment } from "firebase/firestore";

// Define la referencia del contador en la colección "e-wallet-db"
const contadorRef = doc(db, "e-wallet-db", "contador");

// Función para agregar un nuevo usuario con ID incremental
async function agregarNuevoUsuario() {
  // Obtener el valor actual del contador
  const contadorSnapshot = await getDoc(contadorRef);
  let nuevoId;

  if (contadorSnapshot.exists()) {
    // Incrementar el contador existente
    nuevoId = contadorSnapshot.data().contador + 1;
    await setDoc(contadorRef, { contador: increment(1) }, { merge: true });
  } else {
    // Si no existe el contador, iniciarlo en 1
    nuevoId = 1;
    await setDoc(contadorRef, { contador: 1 });
  }

  // Definir los datos del nuevo usuario con el ID incremental
  const nuevoUsuario = {
    id: nuevoId,
    nombre: "Juan Pérez",
    monto: 5000,
    correo: "juan.perez@example.com",
    contraseña: "1234segura",
    codigoqr: "codigoQR123"
  };

  // Agregar el nuevo usuario a la colección "usuarios"
  const usuariosRef = collection(db, "e-wallet-db", "usuarios");
  await addDoc(usuariosRef, nuevoUsuario);

  console.log("Usuario añadido con ID.", nuevoId);
}

// Llamada a la función para agregar un nuevo usuario
agregarNuevoUsuario().catch(console.error);
