import type { IColumn } from '@/utils/interfaces';
import { useState } from 'react';
import { List, Select } from 'antd';
import Table from '@/components/Table/Table';

const TableDanhSachHocPhan = (props: {
  data: { title: string; dataSource: DangKyTinChi.MonHoc[] }[];
  columns: IColumn<DangKyTinChi.MonHoc>[];
}) => {
  const [type, setType] = useState<string>('Danh sách học phần kỳ này');

  const renderSelectTableType = () => (
    <Select
      showSearch
      style={{ width: 250, marginLeft: type === 'Tất cả các học phần' ? '0px' : '-15px' }}
      value={type}
      onChange={(val) => {
        setType(val);
      }}
    >
      {[
        // 'Tất cả các học phần',
        'Danh sách học phần kỳ này',
        'Danh sách học phần học vượt',
        'Danh sách học phần học lại',
        'Danh sách học phần học cải thiện',
        'Danh sách học phần được miễn',
      ].map((tableType) => (
        <Select.Option value={tableType} key={tableType}>
          {tableType}
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <>
      {/* {type === 'Tất cả các học phần' && (
        <>
          <br />
          {renderSelectTableType()}
        </>
      )} */}
      <List
        style={{ paddingRight: 10 }}
        itemLayout="horizontal"
        dataSource={
          type === 'Tất cả các học phần'
            ? props.data
            : props?.data?.filter((item) => item.title === type)
        }
        renderItem={(item) => (
          <List.Item style={{ padding: 0 }} key={item.title}>
            <Table
              otherProps={{
                style: { width: '100%' },
                pagination:
                  item.title === 'Danh sách học phần kỳ này'
                    ? false
                    : {
                        showSizeChanger: true,
                        defaultPageSize: 5,
                        pageSizeOptions: ['5', '10', '25', '50', '100'],
                        showTotal: (tongSo: number) => {
                          return <div>Tổng số: {tongSo}</div>;
                        },
                      },
              }}
              title={renderSelectTableType()}
              columns={props.columns}
              data={item.dataSource}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default TableDanhSachHocPhan;
