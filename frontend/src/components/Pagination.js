import React from "react";

const Pagination = ({ pages, page, setPage }) => {
    const handlePageChange = (e, pageNumber) => {
        e.preventDefault(); // Previene el envío del formulario
        setPage(pageNumber);
    };

    return (
        pages > 1 && (
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={(e) => handlePageChange(e, page - 1)}
                            disabled={page < 2}
                        >
                            Anterior
                        </button>
                    </li>
                    {[...Array(pages).keys()].map((x) => (
                        <li
                            key={`page${x}`}
                            className={`page-item ${
                                x + 1 === page ? "active" : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                onClick={(e) => handlePageChange(e, x + 1)}
                            >
                                {x + 1}
                            </button>
                        </li>
                    ))}

                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={(e) => handlePageChange(e, page + 1)}
                            disabled={page >= pages}
                        >
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        )
    );
};

export default Pagination;
