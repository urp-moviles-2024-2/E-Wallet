import { collection, getDocs } from "firebase/firestore"; 
import { FIREBASE_DATABASE } from "./FirebaseDatabase";

const querySnapshot = await getDocs(collection(FIREBASE_DATABASE, "e-wallet-db"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});