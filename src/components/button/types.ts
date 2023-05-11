import {PropsWithChildren} from "react";

export enum MyButtonType {
    primary = 'primary',
    secondary = 'secondary'
}

export interface MyButtonProps extends PropsWithChildren{
    width?: string;
    height?: string;
    type?: MyButtonType;
    onClick?: () => void;
}