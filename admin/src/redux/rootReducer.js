import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/slices/authSlice";
import employerReducer from "./features/slices/employerSlice";
import jobReducer from "./features/slices/jobSlice";
import titleReducer from "./features/slices/titleSlice";
import categoryReducer from "./features/slices/categorySlice";
import userReducer from "./features/slices/userSlice";
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
  employer: employerReducer,
  job: jobReducer,
  title: titleReducer,
  category: categoryReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export { rootPersistConfig, persistedReducer };
