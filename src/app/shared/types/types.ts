import type { IApproach } from './approach.type';
import type { IMethod } from './method.type';
import type { IPhase } from './phase.type';
import type { ISubphase } from './subphase.type';
import type { ITask } from './task.type';

export type { IApproach } from './approach.type';
export type { IMethod } from './method.type';
export type { IPhase } from './phase.type';
export type { ISubphase } from './subphase.type';
export type { ITask } from './task.type';

export type EntityDataType = IPhase | ISubphase | IMethod | IApproach | ITask;
export type EntityType = Pick<Required<EntityDataType>, 'type'>['type'];
