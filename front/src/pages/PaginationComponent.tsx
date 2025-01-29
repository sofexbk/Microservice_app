import React from 'react';

interface PaginationProps {
  totalPages: number;
  pageNumber: number;
  handlePageClick: (data: { selected: number }) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ totalPages, pageNumber, handlePageClick }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 17; // Nombre maximum de pages visibles

    // Gérer l'affichage des pages
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <li key={i} className={`page-item ${i === pageNumber ? 'active' : ''}`}>
            <a
              href="#"
              className="page-link"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick({ selected: i });
              }}
            >
              {i + 1}
            </a>
          </li>
        );
      }
    } else {
      // Afficher la première page
      pages.push(
        <li key={0} className={`page-item ${0 === pageNumber ? 'active' : ''}`}>
          <a
            href="#"
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick({ selected: 0 });
            }}
          >
            1
          </a>
        </li>
      );

      // Afficher les ellipses si nécessaire
      if (pageNumber > 4) {
        pages.push(<li key="dots1" className="page-item">...</li>);
      }

      // Afficher les pages autour de la page actuelle
      const start = Math.max(1, pageNumber - 2);
      const end = Math.min(totalPages - 2, pageNumber + 2);

      for (let i = start; i <= end; i++) {
        pages.push(
          <li key={i} className={`page-item ${i === pageNumber ? 'active' : ''}`}>
            <a
              href="#"
              className="page-link"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick({ selected: i });
              }}
            >
              {i + 1}
            </a>
          </li>
        );
      }

      // Afficher les ellipses si nécessaire
      if (pageNumber < totalPages - 5) {
        pages.push(<li key="dots2" className="page-item">...</li>);
      }

      // Afficher la dernière page
      pages.push(
        <li key={totalPages - 1} className={`page-item ${totalPages - 1 === pageNumber ? 'active' : ''}`}>
          <a
            href="#"
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick({ selected: totalPages - 1 });
            }}
          >
            {totalPages}
          </a>
        </li>
      );
    }

    return pages;
  };

  return (
    <>
      <style>
        {`
          .pagination {
            display: flex;
            list-style: none;
            padding: 0;
          }

          .pagination li {
            margin: 0 5px;
          }

          .pagination li a {
            display: block;
            padding: 8px 12px;
            border-radius: 5px;
            border: 1px solid #ddd;
            color: #007bff;
            text-decoration: none;
          }

          .pagination li a:hover {
            background-color: #007bff;
            color: white;
          }

          .pagination li.active a {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
          }

          .pagination li.disabled a {
            color: #ddd;
            pointer-events: none;
          }
        `}
      </style>
      <ul className="pagination">
        <li className={`page-item ${pageNumber === 0 ? 'disabled' : ''}`}>
          <a
            href="#"
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber > 0) handlePageClick({ selected: pageNumber - 1 });
            }}
          >
            Précédent
          </a>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${pageNumber === totalPages - 1 ? 'disabled' : ''}`}>
          <a
            href="#"
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber < totalPages - 1) handlePageClick({ selected: pageNumber + 1 });
            }}
          >
            Suivant
          </a>
        </li>
      </ul>
    </>
  );
};

export default PaginationComponent;

