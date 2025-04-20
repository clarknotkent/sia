// src/components/Pagination.jsx


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-between mt-4 text-gray-800">
            <span className="text-sm">Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, totalPages * 5)} of {totalPages * 5} entries</span>
            
            <div className="flex items-center space-x-1">
                <button
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-white hover:bg-gray-200'}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-gray-300 font-bold' : 'bg-white hover:bg-gray-200'}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-white hover:bg-gray-200'}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

import PropTypes from 'prop-types';

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
