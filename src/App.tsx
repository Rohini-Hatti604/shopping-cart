import { Provider } from 'react-redux';
import { store } from './store';
import ProductList from './components/ProductList';
import Basket from './components/Basket';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>Shopping Cart </h1>
          
        </header>
        
        <main className="app-main">
          <div className="container">
            <ProductList />
            <Basket />
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default App;
