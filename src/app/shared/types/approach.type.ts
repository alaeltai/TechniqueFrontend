import type { ITask } from '@teq/shared/types/task.type';
import type { BasePhase } from './phase.type';
import { IRole } from './roles.type';
import { ITemplate } from './template.type';

export interface IApproach extends BasePhase {
    type?: 'approach';
    tasks: ITask[];
    roles: IRole[];
    templates: ITemplate[];
}
