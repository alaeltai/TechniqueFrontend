export interface IArtefact {
    type: string;
    id: string;
    name: string;
    description: string;
    refNo: string;
    owner: string;
    url: {
        uk?: string;
        de?: string;
    };
}
