import Input from "./input";
import Label from "./Label"
import { forwardRef } from "react";

const InputForm = forwardRef((props, ref) => {
    const {label, name, type, placeholder, onChange}  = props;
    return (
        <div className="mb-6">
            <Label htmlFor={name}>{label}</Label>
            <Input name = {name} type= {type} placeholder = {placeholder} ref={ref} onChange={onChange}/>
        </div>
    )
});

export default InputForm;