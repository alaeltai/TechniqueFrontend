export interface IArtefact {
    id: string;
    name: string;
    description: string;
    refNo: string;
    owner: string;
    url: {
        group?: string;
        uk?: string;
        de?: string;
    };
}
