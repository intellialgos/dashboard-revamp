import { OrganisationSite } from "@/types/organisation";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  showEditSiteDrawer: boolean;
  selectedSite: string;
  siteObject: OrganisationSite
};

const initialState: State = {
    selectedSite: "",
    siteObject: {},
    showEditSiteDrawer: false
};

const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    setSelectedSite(state, action: PayloadAction<string>) {
      state.selectedSite = action.payload;
    },
    setShowEditSiteDrawer(state, action: PayloadAction<boolean>) {
      state.showEditSiteDrawer = action.payload;
    },
    setSiteObject(state, action: PayloadAction<OrganisationSite>) {
      state.siteObject = action.payload;
    },
  },
});

export const sites = sitesSlice.reducer;

export const {
    setSelectedSite,
    setShowEditSiteDrawer,
    setSiteObject
} = sitesSlice.actions;
