import React from 'react';

const Textarea = ({title, rows, data, setData}) => {
    return ( 
        <div className="form-group">
            <label style={{fontWeight: 'normal'}}>{title}</label>
            <textarea className="form-control" rows={rows} placeholder="Escribe aquí ..." value={data} onChange={(e) => setData(e.target.value)} />
        </div>
     );
}
 
export default Textarea;