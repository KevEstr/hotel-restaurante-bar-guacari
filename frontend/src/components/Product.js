import React, { useEffect, useRef, useState } from "react";
import { Textfit } from 'react-textfit';

import "../../src/utils/menu.css"
import LinesEllipsis from "react-lines-ellipsis";


const Product = ({ product }) => {

    // Función para determinar el color de fondo según la categoría del producto
    const getCategoryBackgroundClass = (category) => {
        switch (category) {
            case 'CERVEZAS':
                return 'category1-background'; // Clase CSS para la primera categoría
            case 'HAMBURGUESAS':
                return 'category2-background'; // Clase CSS para la segunda categoría
            case 'GASEOSAS':
                return 'category3-background'; // Clase CSS para la tercera categoría
            // Agrega más casos según sea necesario para otras categorías
            default:
                return ''; // Si no hay una categoría definida, no se aplica ningún color de fondo
        }
    };

    return (
        <button className={`product-name-${getCategoryBackgroundClass(product.category.name)}`}>
            <h4>
                <LinesEllipsis
                    text={product.name}
                    maxLine={3}
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                />
            </h4>
        </button>
    );
};

export default Product;