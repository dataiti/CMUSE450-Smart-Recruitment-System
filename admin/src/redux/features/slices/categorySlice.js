import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    listCategories: [],
    totalPage: 0,
    currentPage: 0,
    count: 0,
  },
  reducers: {
    setListCategories: (state, action) => {
      state.listCategories = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
      state.count = action.payload.count;
    },
    addCategory: (state, action) => {
      state.listCategories.unshift(action.action.data);
    },
    removeCategoryItem: (state, action) => {
      const categoryId = action.payload._id;
      const categoryIndex = state.listCategories.findIndex(
        (item) => item._id === categoryId
      );

      if (categoryIndex !== -1) {
        state.listCategories.splice(categoryIndex, 1);
      }
    },
    updateCategoryItem: (state, action) => {
      const categoryId = action.payload.data._id;
      const categoryIndex = state.listCategories.findIndex(
        (item) => item._id === categoryId
      );

      if (categoryIndex !== -1) {
        state.listCategories[categoryIndex] = action.payload.data;
      }
    },
    toggleUpdateActiveCategory: (state, action) => {
      const categoryId = action.payload.data._id;
      const categoryIndex = state.listCategories.findIndex(
        (item) => item._id === categoryId
      );

      if (categoryIndex !== -1) {
        state.listCategories[categoryIndex].isActive =
          !state.listCategories[categoryIndex].isActive;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const categorySelect = (state) => state.category;

export const {
  setListCategories,
  addCategory,
  removeCategoryItem,
  updateCategoryItem,
  toggleUpdateActiveCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
