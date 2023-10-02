import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/slices/authSlice";
import { rootApi } from "../configs/rootApi";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist: [],
  // blacklist: [],
};

const rootReducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export { rootPersistConfig, persistedReducer };
