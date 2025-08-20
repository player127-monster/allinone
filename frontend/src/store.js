import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // Import thunk as a named export
import productsReducer  from './slices/productsSlice';
import productReducer  from './slices/productSlice';
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice'

const reducer = combineReducers({
  // Your reducers go here
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState:cartReducer,
  orderState:orderReducer,
  userState: userReducer
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Add redux-thunk middleware
});

export default store;