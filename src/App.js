import CSS from './App.module.css';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import Header from 'components/Header';
import Chat from './components/Chat';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <div className={CSS.App}>
        <Header />
        <Chat />
      </div>
    </Provider>
  );
}

export default App;
