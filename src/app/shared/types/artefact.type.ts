import { IOwner } from '@teq/shared/types/owner.type';
export interface IArtefact {
    id: string;
    name: string;
    description: string;
    refNo: string;
    // owner: IOwner;
    // artefactOutputUrls: IArtefactUrl[];
    // artefactInputUrls: IArtefactUrl[];
}
