import React from 'react'

function NameSelector({name, setName}){

    return (
        <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputName">Name</label>
            <input onChange={(e) => setName(e.target.value)} value={name} id="inputName" type="text" className="form-control"/>
        </div>
    )
}

export default NameSelector