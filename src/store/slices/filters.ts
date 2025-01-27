import { formatDate, getLastWeekDate, getTodayDate } from "@/utils/general-helpers";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
    priority: number[];
    sites: string[];
    startTime: string;
    endTime: string;
    vendors: string[];
    devices: string[];
    eventType: string|null;
};


const date = new Date();

const initialState: State = {
    priority: [0, 1, 2, 3, 4, 5],
    sites: [],
    startTime: formatDate(getLastWeekDate(date)),
    endTime: formatDate(new Date()),
    vendors: [],
    devices: [],
    eventType: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<State>>) {
        Object.assign(state, action.payload);
    },
    clearFilters(state, action: PayloadAction<(keyof State)[]>) {
        const filtersToClear = action.payload;
  
        filtersToClear.forEach((filterKey) => {
          if (filterKey in initialState) {
            // Reset the specified filter to its initial value
            state[filterKey] = initialState[filterKey];
          }
        });
    },
  },
});

export const filters = filtersSlice.reducer;

export const {
  setFilters,
  clearFilters
} = filtersSlice.actions;
