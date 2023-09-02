// import { faQuestion } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import useDebounce from 'hooks/useDebounce';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';

interface IDataTableProps {
  rows: any;
  columns: any;
  parentContainerRef: RefObject<HTMLDivElement>;
}

const DataTable = ({ rows, columns, parentContainerRef }: IDataTableProps) => {
  const [width, setWidth] = useState<number>(0);
  const tableWrapRef = useRef<HTMLDivElement>(null);

  const adjustWidth = () => {
    const tableWrap = tableWrapRef.current;
    const parentContainer = parentContainerRef!.current;
    if (tableWrap!.clientWidth > parentContainer!.clientWidth) {
      tableWrap!.style.width = 'unset';
    } else {
      tableWrap!.style.width = 'fit-content';
    }
  };

  const getRowClassName = (params: any) => {
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-white' : 'bg-primary-subtle';
  };

  useEffect(() => {
    const parentContainer = parentContainerRef.current;
    window.addEventListener('resize', () => {
      setWidth(parentContainer!.clientWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWidth(parentContainer!.clientWidth);
      });
    };
  }, []);

  useDebounce(adjustWidth, 500, [width]);

  return (
    <Col className="table-wrap" ref={tableWrapRef}>
      <div>
        {/* <div className="d-flex justify-content-end mb-2">
          <Button className="align-self-start" variant="info">
            <FontAwesomeIcon icon={faQuestion} />
          </Button>
        </div> */}
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          getRowClassName={getRowClassName}
        />
      </div>
    </Col>
  );
};
export default DataTable;
