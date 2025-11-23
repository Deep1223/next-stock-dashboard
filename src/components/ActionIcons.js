"use client";

import React from "react";

const ActionIcons = (props) => {
    if (props.type === 'eye') {
        return (
            <i className="fi fi-rr-eye"></i>
        )
    }
    else if (props.type === 'eye-slash') {
        return (
            <i className="fi fi-rr-eye-crossed"></i>
        )
    }
    else if (props.type === 'edit') {
        return (
            <i className="fi fi-rr-edit"></i>
        )
    }
};

export default ActionIcons;