import "./Pagination.css";

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  totalItems: number;
  tamanoPagina: number;
  onPageChange: (nuevaPagina: number) => void;
}

export default function Pagination({
  pagina,
  totalPaginas,
  totalItems,
  tamanoPagina,
  onPageChange,
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const desde = (pagina - 1) * tamanoPagina + 1;
  const hasta = Math.min(pagina * tamanoPagina, totalItems);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPaginas; i++) {
      if (
        i === 1 ||
        i === totalPaginas ||
        (i >= pagina - delta && i <= pagina + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Navegación de páginas">
      <div className="pagination__info">
        Mostrando <strong>{desde.toLocaleString()}</strong>–<strong>{hasta.toLocaleString()}</strong> de{" "}
        <strong>{totalItems.toLocaleString()}</strong> lugares
      </div>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn pagination__btn--nav"
          onClick={() => onPageChange(pagina - 1)}
          disabled={pagina <= 1}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        <div className="pagination__pages">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="pagination__ellipsis">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`pagination__btn pagination__btn--page ${
                  p === pagina ? "pagination__btn--active" : ""
                }`}
                onClick={() => onPageChange(p)}
                aria-current={p === pagina ? "page" : undefined}
                aria-label={`Ir a la página ${p}`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="pagination__btn pagination__btn--nav"
          onClick={() => onPageChange(pagina + 1)}
          disabled={pagina >= totalPaginas}
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </div>
    </nav>
  );
}
