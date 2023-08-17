export interface ILandingCard {
    title: string;
    description: string;
    button: ILandingButton;
    image: string;
}

export interface ILandingButton {
    name: string;
    link: string;
}
