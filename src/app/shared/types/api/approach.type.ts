import type { IAPITemplate } from './template.type';
import type { IAPIBasePhase } from './phase.type';
import type { IAPIRole } from './role.type';
import type { IAPITask } from './task.type';

export interface IAPIApproach extends IAPIBasePhase {
    Templates: IAPITemplate[];
    Accountable: IAPIRole;
    Responsibles: IAPIRole[];
    Tasks: IAPITask[];
}
