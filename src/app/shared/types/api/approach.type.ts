import type { IAPITemplate } from './template.type';
import type { IAPIBasePhase } from './phase.type';
import type { IAPIRole } from './role.type';
import type { IAPITask } from './task.type';

export interface IAPIApproach extends IAPIBasePhase {
    templates: IAPITemplate[];
    accountable: IAPIRole;
    responsibles: IAPIRole[];
    tasks: IAPITask[];
}
