import React from "react";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface selectOptions {
    [key: string]: [number, string]
}

interface InputWithIconProps {
    labelText: string,
    inputClass: string,
    inputType: string,
    inputName: string,
    inputValue: string | number,
    inputPlaceholder: string
    icon: IconDefinition,
    iconClass: string,
    onChange: any,
}

interface InputWithIconAndMulProps extends InputWithIconProps {
    mulValue: number,
    mulItems: selectOptions
}

export const InputWithIconAndMul = (props: InputWithIconAndMulProps) =>
    <>
        <label className="label">{props.labelText}</label>
        <div className="field has-addons">
            <div className="control has-icons-right is-expanded">
                <input
                    className={`input ${props.inputClass}`}
                    type={props.inputType}
                    name={props.inputName}
                    placeholder={props.inputPlaceholder}
                    value={Number(props.inputValue) === 0 ? "" : props.inputValue}
                    onChange={props.onChange}
                />
                <span className={`icon is-right ${props.iconClass}`}>
                    <FontAwesomeIcon icon={props.icon}/>
                </span>
            </div>
            <div className="control">
                <div className="select is-fullwidth">
                    <select
                        className="select"
                        name={props.inputName + "Mul"}
                        value={props.mulValue}
                        onChange={props.onChange}
                    >
                        {createSelectOptions(props.mulItems)}
                    </select>
                </div>
            </div>
        </div>
    </>


export const InputWithIcon = (props: InputWithIconProps) =>
    <>
        <label className="label">{props.labelText}</label>
        <div className="field">
            <div className="control has-icons-right">
                <input
                    className={`input ${props.inputClass}`}
                    type={props.inputType}
                    name={props.inputName}
                    placeholder={props.inputPlaceholder}
                    value={Number(props.inputValue) === 0 ? "" : props.inputValue}
                    onChange={props.onChange}
                />
                <span className={`icon is-right ${props.iconClass}`}>
                    <FontAwesomeIcon icon={props.icon}/>
                </span>
            </div>
        </div>
    </>

function createSelectOptions(dict: selectOptions) {
    let options = [];
    for (let key in dict) {
        if (dict.hasOwnProperty(key)) {
            options.push(<option value={dict[key][0]} key={key}>{dict[key][1]}</option>);
        }
    }

    return options;
}
