import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
   filtersLoadingStatus: 'idle',
   activeFilter: 'all'
});

export const fetchFilters = createAsyncThunk(
   'filters/fetchFilters',
   async () => {
      const {request} = useHttp();
      return await request("http://localhost:3001/filters");
   }
)

const filtersFilterSlice = createSlice({
   name: 'filters',
   initialState,
   reducers: {
      filtersFetchingError: state => {state.filtersLoadingStatus = 'error'},
      filterChange: (state, action) => {state.activeFilter = action.payload}
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
         .addCase(fetchFilters.fulfilled, (state, action) => {
            filterAdapter.setMany(state, action.payload);
            state.filtersLoadingStatus = 'idle';
         })
         .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
         .addDefaultCase(() => {})
   }
})

const {actions, reducer} = filtersFilterSlice;

export const {selectAll} = filterAdapter.getSelectors(state => state.filters);

export default reducer;

export const {filterChange} = actions;