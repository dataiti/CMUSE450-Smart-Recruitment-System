import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/slices/authSlice";
import employerReducer from "./features/slices/employerSlice";
import jobReducer from "./features/slices/jobSlice";
import titleReducer from "./features/slices/titleSlice";
import categoryReducer from "./features/slices/categorySlice";
import userReducer from "./features/slices/userSlice";
<<<<<<< HEAD
import storiesReducer from "./features/slices/storiesRasaSlice";
import rulesReducer from "./features/slices/rulesRasaSlice"
=======
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
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
<<<<<<< HEAD
  stories: storiesReducer,
  rules: rulesReducer,
=======
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export { rootPersistConfig, persistedReducer };
