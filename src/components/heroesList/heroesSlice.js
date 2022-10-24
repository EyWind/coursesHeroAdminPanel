import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroesAdapter = createEntityAdapter(); // creating our adapter

const initialState = heroesAdapter.getInitialState({ // assigning init state
   heroesLoadingStatus: 'idle'
})

export const fetchHeroes = createAsyncThunk(
   'heroes/fetchHeroes',
   async () => {
      const {request} = useHttp();
      return await request("http://localhost:3001/heroes");
   }
)

const heroesSlice = createSlice({
   name: 'heroes',
   initialState,
   reducers: {
      heroCreated: (state, action) => {heroesAdapter.addOne(state, action.payload)},
      heroDelete: (state, action) => {heroesAdapter.removeOne(state, action.payload)}
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
         .addCase(fetchHeroes.fulfilled, (state, action) => {
            state.heroesLoadingStatus = 'idle';  
            // state.heroes = action.payload;
            heroesAdapter.setAll(state, action.payload); // adding heroes to state
         })
         .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
         .addDefaultCase(() => {})
   }
})

const {actions, reducer} = heroesSlice;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes); // getting heroes in array format

export const filteredHeroesSelector = createSelector( // creating selector and exporting it
   state => state.filters.activeFilter,
   selectAll,
   (filter, heroes) => filter === "all" ? heroes : heroes.filter(e => e.element === filter)
);

export default reducer;
export const {heroCreated, heroDelete} = actions;

