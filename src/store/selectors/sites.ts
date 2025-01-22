import { RootState } from "@/types/store";

const getState = (state: RootState) => state.sites;

export const getSelectedSite = (state: RootState) => getState(state).selectedSite;
export const getShowEditSiteDrawer = (state: RootState) => getState(state).showEditSiteDrawer;
export const getSiteObject = (state: RootState) => getState(state).siteObject;