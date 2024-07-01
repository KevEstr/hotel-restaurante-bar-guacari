import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";

const Select = ({ items, data, setData, disabled, search = () => {} }) => {
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        mapSelect().forEach((item) => {
            if (item.value === data) {
                setCurrent(item);
            }
        });
    }, [items, data]);

    const mapSelect = () => {
        const mapped = items.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        return mapped;
    };

    const handleChange = (element) => {
        setCurrent(element);
        setData(parseInt(element.value));
    };

    const options = mapSelect();
    const isMultiColumn = options.length > 10; // Cambiar a 2 columnas si hay más de 10 opciones

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            display: 'flex',
            flexDirection: 'column',
        }),
        menuList: (provided) => ({
            ...provided,
            display: 'grid',
            gridTemplateColumns: isMultiColumn ? '1fr 1fr' : '1fr',
        }),
    };

    return (
        <ReactSelect
            options={options}
            onChange={handleChange}
            value={current}
            onKeyDown={search}
            onFocus={search}
            placeholder="Selecciona un valor"
            isDisabled={disabled}
            isSearchable
            styles={customStyles}
        />
    );
};

export default Select;
