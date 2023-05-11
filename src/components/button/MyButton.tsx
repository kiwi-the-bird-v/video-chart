import React, {FC} from 'react';
import classes from "./MyButton.module.css";
import {MyButtonProps, MyButtonType} from "./types";


const MyButton: FC <MyButtonProps> = ({
    width,
    height,
    type = MyButtonType.primary,
    onClick,
    children
    }) => {

    const typeClass = () => {
        switch (type){
            case MyButtonType.primary:
                return classes.primary
            case MyButtonType.secondary:
                return classes.secondary
        }
    }
    const rootClasses = [classes.my__button, typeClass()]

    return (
        <button className={rootClasses.join(' ')}
             onClick={onClick}
             style={{
                 width,
                 height
             }}>
            {children}
        </button>
    );
};

export default MyButton;