import { Organisation, OrganisationGroup, OrganisationSite } from "@/types/organisation";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  showEditSiteDrawer: boolean;
  showConfigureSiteDrawer: boolean;
  showEditOrgDrawer: boolean;
  showEditGroupDrawer: boolean;
  selectedSite: string;
  selectedGroup: string;
  selectedOrg: string;
  siteObject: OrganisationSite;
  orgObject: Organisation;
  groupObject: OrganisationGroup;
};

const initialState: State = {
    selectedSite: "",
    siteObject: {},
    orgObject: {},
    groupObject: {},
    showEditSiteDrawer: false,
    showEditOrgDrawer: false,
    showEditGroupDrawer: false,
    showConfigureSiteDrawer: false
};

const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    setSelectedSite(state, action: PayloadAction<string>) {
      state.selectedSite = action.payload;
    },
    setSelectedGroup(state, action: PayloadAction<string>) {
      state.selectedGroup = action.payload;
    },
    setSelectedOrg(state, action: PayloadAction<string>) {
      state.selectedOrg = action.payload;
    },
    setShowEditSiteDrawer(state, action: PayloadAction<boolean>) {
      state.showEditSiteDrawer = action.payload;
    },
    setShowEditOrgDrawer(state, action: PayloadAction<boolean>) {
      state.showEditOrgDrawer = action.payload;
    },
    setShowConfigureSiteDrawer(state, action: PayloadAction<boolean>) {
      state.showConfigureSiteDrawer = action.payload;
    },
    setShowEditGroupDrawer(state, action: PayloadAction<boolean>) {
      state.showEditGroupDrawer = action.payload;
    },
    setSiteObject(state, action: PayloadAction<OrganisationSite>) {
      state.siteObject = action.payload;
    },
    setGroupObject(state, action: PayloadAction<OrganisationGroup>) {
      state.groupObject = action.payload;
    },
    setOrgObject(state, action: PayloadAction<Organisation>) {
      state.orgObject = action.payload;
    },
  },
});

export const sites = sitesSlice.reducer;

export const {
    setSelectedSite,
    setShowEditSiteDrawer,
    setShowEditGroupDrawer,
    setShowEditOrgDrawer,
    setSiteObject,
    setGroupObject,
    setOrgObject,
    setShowConfigureSiteDrawer,
    setSelectedGroup,
    setSelectedOrg
} = sitesSlice.actions;
