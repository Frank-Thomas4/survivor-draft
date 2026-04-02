import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDfVhInY4stFvwokh9QlcdTqcpvQWnJHJo",
  authDomain: "survivor-draft-53b8e.firebaseapp.com",
  projectId: "survivor-draft-53b8e",
  storageBucket: "survivor-draft-53b8e.firebasestorage.app",
  messagingSenderId: "325764144002",
  appId: "1:325764144002:web:878bba801565c24d90cd9b"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
