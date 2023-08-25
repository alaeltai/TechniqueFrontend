import type { BasePhase } from './phase.type';
import type { IRole } from './roles.type';
import { ICategory } from './category.type';
import { IArtefact } from '@teq/shared/types/artefact.type';

export interface ITask extends Omit<BasePhase, 'description'> {
    type?: 'task';
    purpose: string;
    how: string;
    responsible: IRole;
    category: ICategory;
    inputArtefacts: IArtefact[];
    artefacts: IArtefact[];
    inputDescription: string;
    outputDescription: string;
}
