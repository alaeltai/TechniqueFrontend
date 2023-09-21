import type { IAPIMethod } from './method.type';
import type { IAPIBasePhase } from './phase.type';

export interface IAPISubPhase extends IAPIBasePhase {
    methods: IAPIMethod[];
}
