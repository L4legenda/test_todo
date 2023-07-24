import { useEffect, useState } from "react"


export const Task = ({ value, onChange, onClickSplit }: { value: any, onChange: any, onClickSplit: any }) => {
    const [_value, _setValue] = useState(value)
    useEffect(() => {
        onChange(_value);
    }, [_value])
    return <div>
        <textarea value={_value} onChange={(e) => { _setValue(e.target.value) }}></textarea>
        <button onClick={onClickSplit}>Split</button>
    </div>
} 