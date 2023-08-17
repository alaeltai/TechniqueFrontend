import type { IApproach } from '@teq/shared/types/approach.type';
import type { BasePhase } from './phase.type';

export interface IMethod extends BasePhase {
    type?: 'method';
    approaches: IApproach[];
}
