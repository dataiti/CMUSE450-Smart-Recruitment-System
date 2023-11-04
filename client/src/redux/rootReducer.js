import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/slices/authSlice";
import jobReducer from "./features/slices/jobSlice";
import messageReducer from "./features/slices/messageSlice";
import { rootApi } from "../configs/rootApi";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["auth"],
  // blacklist: [],
};

const rootReducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  auth: authReducer,
  job: jobReducer,
  message: messageReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export { rootPersistConfig, persistedReducer };
