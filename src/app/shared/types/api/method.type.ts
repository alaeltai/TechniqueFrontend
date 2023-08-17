import type { IAPIApproach } from './approach.type';
import type { IAPIBasePhase } from './phase.type';

export interface IAPIMethod extends IAPIBasePhase {
    Approaches: IAPIApproach[];
}
