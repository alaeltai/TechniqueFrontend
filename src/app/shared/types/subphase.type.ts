import type { IMethod } from '@teq/shared/types/method.type';
import type { BasePhase } from './phase.type';

export interface ISubphase extends BasePhase {
    type?: 'subphase';
    methods: IMethod[];
}
