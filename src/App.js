 import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import React, { useState } from 'react';

// Firebase configuration
const firebaseConfig = {
  // Your firebase config here...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// SignIn Component
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <button className="sign-in-btn" onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

// Chatroom Component
function Chatroom() {
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  };

  return (
    <>
      <div className='chat-messages-container'>
        {messages && messages.map((msg, index) => (
          <ChatMessage key={msg.id} message={msg} index={index} />
        ))}
      </div>

      <form onSubmit={sendMessage} className="send-message-form">
        <input value={formValue} placeholder='Type your message...' onChange={(e) => setFormValue(e.target.value)} className="message-input" />
        <button type="submit" className="send-btn">
          <img src={'/send-icon.svg'} alt="Send" className="send-icon" />
        </button>
      </form>
    </>
  );
}

// ChatMessage Component
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User Avatar" className="avatar" /> 
      <p className="message-text">{text}</p>
    </div>
  );
}

// SignOut Component
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out-btn" onClick={() => auth.signOut()}>Sign Out</button>
  );
}

// App Component
function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        {user ? <><SignOut /><Chatroom /></> : <SignIn />}
      </header>
    </div>
  );
}

export default App;
