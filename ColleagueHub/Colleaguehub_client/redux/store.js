import {createStore, applyMiddleware} from 'redux'
import reducer from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

const composeEnhancers = composeWithDevTools({ realtime: true });

const persistConfig = {
  key:'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, reducer)
export const store = createStore(
    persistedReducer,
    composeEnhancers(
    applyMiddleware(thunk)
  )
)
export const persistor = persistStore(store)


