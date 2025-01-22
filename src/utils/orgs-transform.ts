import { Organisation, OrganisationGroup } from "@/types/organisation";
import { organizeOrgs } from "./organizeOrgs";

const getGroupsAndSite = (groups: OrganisationGroup[]): any[] => {
    return groups.map((group: OrganisationGroup) => {
        // Initialize children array
        const children: any[] = [];

        // Recursively process nested groups
        if (group?.groups) {
            children.push(...getGroupsAndSite(group.groups));
        }

        // Add sites to children if available
        if (group?.sites) {
            children.push(
                ...group.sites.map((site) => ({
                    key: `site-${site.id}`,
                    id: site.id,
                    checkId: `${group.id}-${site.id}`,
                    name: site.name,
                    boxType: site.boxType,
                    isGroup: false,
                    isOrganisation: false,
                    isSite: true
                }))
            );
        }

        // Return the processed group with its children
        return {
            key: `group-${group.id}`,
            id: group.id,
            checkId: `${group.id}-${group.id}`,
            name: group.name,
            isGroup: true,
            isOrganisation: false,
            children: (children.length > 0) ? children : null, // Include both groups and sites
        };
    });
};

export const TransformOrgs = (data: Organisation[]): any[] => {
    const organized = organizeOrgs(data);

    return organized.map((org: Organisation) => {
        // Process groups and sites for each organisation
        const children: any[] = [];

        // Add groups and their nested children
        if (org.groups) {
            children.push(...getGroupsAndSite(org.groups));
        }

        // Add standalone sites
        if (org?.sites) {
            children.push(
                ...org.sites.map((site) => ({
                    key: `site-${site.id}`,
                    id: site.id,
                    checkId: `${org.id}-${site.id}`,
                    name: site.name,
                    boxType: site.boxType,
                    status: site.connectionState,
                    isGroup: false,
                    isSite: true,
                    isOrganisation: false
                }))
            );
        }

        // Return the organisation structure
        return {
            key: `org-${org.id}`,
            id: org.id,
            name: org.name,
            isOrganisation: true,
            isSite: false,
            isGroup: false,
            children: children.length > 0 ? children : null,
        };
    });
};
