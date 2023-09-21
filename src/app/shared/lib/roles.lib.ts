import type { IRole, RoleType } from '@teq/shared/types/roles.type';
import { environment } from 'environments/environment';

type RolesMap = {
    [role in RoleType]: {
        color: string;
    };
};

const rolesMap: RolesMap = {
    Unknown: { color: 'red' },
    'Account Team': { color: '#9B51E0' },
    'Bid Manager': { color: '#219653' },
    'Consultant (Business)': { color: '#24387F' },
    'Consultant (Change)': { color: '#56CCF2' },
    'Consultant (Innovation)': { color: '#2F80ED' },
    'Consultant (Testing)': { color: '#6FCF97' },
    'Opportunity Owner': { color: '#219653' },
    'Project Lead': { color: '#6FCF97' },
    'Service Team': { color: '#BB6BD9' },
    'Solution Architect': { color: '#F2C94C' },
    'Solution Lead': { color: '#F2994A' },
    Manager: { color: '#EB5757' }
};

export function normalizeName(name: string): RoleType {
    if (name in rolesMap) {
        return name as RoleType;
    }

    if (!environment.production) {
        console.warn(`Unrecognized role type: ${name}`);
    }

    return name as RoleType;
}

export function determineRoleColor(role: IRole): IRole {
    return {
        ...role,
        color: (rolesMap[role.name] ?? rolesMap.Unknown).color
    };
}
