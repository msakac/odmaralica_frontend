import { DataGrid } from '@mui/x-data-grid';
import useDebounce from 'modules/common/hooks/useDebounce';
import { Animate } from 'modules/common/components';
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
      <Animate>
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
      </Animate>
    </Col>
  );
};
export default DataTable;
