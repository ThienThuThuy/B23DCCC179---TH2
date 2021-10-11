import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Result, Row, Table } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useModel } from 'umi';
import InfoDot from './InfoDot';
import TableDanhSachHocPhan from './TableDanhSachHocPhan';
import TableDanhSachHocPhanDaChon from './TableDanhSachHocPhanDaChon';

interface LopDaChon extends DangKyTinChi.LopTinChi, DangKyTinChi.MonHoc {
  idNhomLop?: number;
  soThuTuNhomLop?: number;
  tongSoSinhVienNhomLop?: number;
  siSoNhomLop?: number;
  loaiNhom?: string;
}

const TinChi = (props: {
  danhSachHocPhanKyNay: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocVuot: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocCaiThien: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocLai: DangKyTinChi.MonHoc[];
  danhSachTatCaHocPhan: DangKyTinChi.MonHoc[];
}) => {
  const {
    recordDotTinChi,
    setCurrent,
    getDotDangKyTinChiByKyHocModel,
    getDSLopDaDangKyByIdDotModel,
    getThongTinKyHocModel,
    getDSLopTinChiByIdDotAndIdMonHocModel,
    getDSNhomLopTinChiByIdLopModel,
    setDanhSachLopTinChi,
    danhSachLopTinChi,
    loading,
    danhSachLopDaDangKy,
    danhSachNhomLopTinChi,
    setDanhSachNhomLopTinChi,
  } = useModel('dangkytinchi');

  const { record } = useModel('kyhoc');
  const [recordHocPhanCurrent, setRecordHocPhanCurrent] = useState<DangKyTinChi.MonHoc>(
    {} as DangKyTinChi.MonHoc,
  );

  const [recordLopCurrent, setRecordLopCurrent] = useState<DangKyTinChi.LopTinChi>(
    {} as DangKyTinChi.LopTinChi,
  );
  const [danhSachLopDaChon, setDanhSachLopDaChon] = useState<LopDaChon[]>([]);
  let tongSoTinChi = 0;
  let tongHocPhi = 0;
  const checkTimeDangKy =
    moment(recordDotTinChi?.ngay_bat_dau_tin_chi).isAfter(moment(new Date())) &&
    moment(new Date()).isBefore(moment(recordDotTinChi?.ngay_ket_thuc_tin_chi));
  danhSachLopDaChon?.forEach((item) => {
    tongSoTinChi += item.soTinChi;
    tongHocPhi += item.hocPhi;
  });
  const onSelectLopTinChi = async (
    value: CheckboxChangeEvent,
    recordLopTinChi: DangKyTinChi.LopTinChi,
  ) => {
    if (value.target.checked) {
      const dsNhomLop = await getDSNhomLopTinChiByIdLopModel(recordLopTinChi.idLop);
      const lopDaChonCuaHocPhanHienTai = danhSachLopDaChon?.find(
        (item) => item.idHocPhan === recordHocPhanCurrent.idHocPhan,
      );
      if (dsNhomLop?.length === 0) {
        setDanhSachLopDaChon([
          ...danhSachLopDaChon?.filter((item) => item.idLop !== lopDaChonCuaHocPhanHienTai?.idLop),
          { ...recordLopTinChi, ...recordHocPhanCurrent },
        ]);
      }

      setRecordLopCurrent(recordLopTinChi);
    } else {
      setDanhSachLopDaChon(
        danhSachLopDaChon?.filter((item) => item.idLop !== recordLopTinChi.idLop),
      );
      setRecordLopCurrent({} as DangKyTinChi.LopTinChi);
      setDanhSachNhomLopTinChi([]);
    }
  };

  const onSelectNhomLopTinChi = async (
    value: CheckboxChangeEvent,
    recordNhomLopTinChi: DangKyTinChi.NhomLopTinChi,
  ) => {
    if (value.target.checked) {
      const lopDaChonCuaHocPhanHienTai = danhSachLopDaChon?.find(
        (item) => item.idHocPhan === recordHocPhanCurrent.idHocPhan,
      );
      setDanhSachLopDaChon([
        ...danhSachLopDaChon?.filter((item) => item.idLop !== lopDaChonCuaHocPhanHienTai?.idLop),
        { ...recordNhomLopTinChi, ...recordLopCurrent, ...recordHocPhanCurrent },
      ]);
    } else {
      setDanhSachLopDaChon(
        danhSachLopDaChon.filter((item) => item.idNhomLop !== recordNhomLopTinChi.idNhomLop),
      );
    }
  };

  const onCell = (recordHP: DangKyTinChi.MonHoc) => ({
    onClick: async () => {
      setDanhSachNhomLopTinChi([]);
      setDanhSachLopTinChi([]);
      setRecordHocPhanCurrent(recordHP);
      getDSLopTinChiByIdDotAndIdMonHocModel(recordHP.idHocPhan);
      const recordLopDaChon = danhSachLopDaChon?.find(
        (lop) => lop.idHocPhan === recordHP.idHocPhan,
      );
      if (recordLopDaChon?.idLop) {
        getDSNhomLopTinChiByIdLopModel(recordLopDaChon.idLop);
      }
      setRecordLopCurrent(
        danhSachLopDaChon?.find((lop) => lop.idHocPhan === recordHP.idHocPhan) ??
          ({} as DangKyTinChi.LopTinChi),
      );
    },
    style: { cursor: 'pointer' },
  });

  const renderCell = (val: string, recordMonHoc: DangKyTinChi.MonHoc) => (
    <div
      style={{
        color: recordMonHoc.idHocPhan === recordHocPhanCurrent?.idHocPhan ? '#CC0D00' : '#000',
      }}
    >
      {val}
    </div>
  );

  const columns: IColumn<DangKyTinChi.MonHoc>[] = [
    {
      title: 'Học phần',
      dataIndex: 'tenMonHoc',
      width: 200,
      align: 'center',
      onCell,
      render: renderCell,
      search: 'search',
    },
    {
      title: 'Mã học phần',
      dataIndex: 'maMonHoc',
      width: 200,
      align: 'center',
      render: renderCell,
      onCell,
      search: 'search',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
      render: renderCell,
      onCell,
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      width: 100,
      align: 'center',
      render: (val, recordMonHoc) => (
        <div
          style={{
            color: recordMonHoc.idHocPhan === recordHocPhanCurrent?.idHocPhan ? '#CC0D00' : '#000',
          }}
        >
          {currencyFormat(val)}
        </div>
      ),
      onCell,
    },
  ];

  const columnsLopDaChon: IColumn<LopDaChon>[] = [
    {},
    {
      title: 'Học phần',
      dataIndex: 'tenMonHoc',
      // width: 200,
      align: 'center',
      search: 'search',
      render: (val) => <div style={{ fontWeight: val === 'Tổng' ? 'bold' : 'normal' }}>{val}</div>,
    },
    {
      title: 'Mã học phần',
      dataIndex: 'maMonHoc',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'STT Lớp',
      dataIndex: 'soThuTuLop',
      width: 100,
      align: 'center',
    },
    {
      title: 'STT Nhóm',
      dataIndex: 'soThuTuNhomLop',
      width: 100,
      align: 'center',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
      render: (val, recordLop) => (
        <div style={{ fontWeight: recordLop?.tenMonHoc === 'Tổng' ? 'bold' : 'normal' }}>{val}</div>
      ),
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      width: 200,
      align: 'center',
      render: (val, recordLop) => (
        <div style={{ fontWeight: recordLop?.tenMonHoc === 'Tổng' ? 'bold' : 'normal' }}>
          {currencyFormat(val)}
        </div>
      ),
    },
  ];

  const data = [
    { title: 'Danh sách học phần kỳ này', dataSource: props.danhSachHocPhanKyNay },
    {
      title: 'Danh sách học phần học vượt',
      dataSource: props.danhSachHocPhanHocVuot,
    },
    {
      title: 'Danh sách học phần học lại',
      dataSource: props.danhSachHocPhanHocLai,
    },
    {
      title: 'Danh sách học phần học cải thiện',
      dataSource: props.danhSachHocPhanHocCaiThien,
    },
  ];

  const columnsLopTinChi: IColumn<DangKyTinChi.LopTinChi>[] = [
    {
      title: 'Đăng ký',
      dataIndex: 'soThuTuKyHoc',
      render: (val, recordLopTinChi) => (
        <Checkbox
          checked={recordLopCurrent.idLop === recordLopTinChi.idLop}
          // checked={!!danhSachLopDaChon?.find((item) => item.idLop === recordLopTinChi.idLop)}
          onChange={(value) => onSelectLopTinChi(value, recordLopTinChi)}
        />
      ),
      width: 100,
      align: 'center',
    },
    {
      title: 'Học phần',
      render: () => <div>{recordHocPhanCurrent?.tenMonHoc}</div>,
      align: 'center',
      // width: 200,
    },
    {
      title: 'Số thứ tự lớp',
      dataIndex: 'soThuTuLop',
      align: 'center',
      width: 100,
    },
    {
      title: 'Tổng số sinh viên',
      dataIndex: 'tongSoSinhVienLop',
      align: 'center',
      width: 100,
    },
    {
      title: 'Sĩ số tối đa',
      dataIndex: 'siSoLop',
      align: 'center',
      width: 100,
    },
    {
      title: 'Số lượng nhóm',
      dataIndex: 'soLuongNhom',
      align: 'center',
      width: 100,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'tenGiangVien',
      align: 'center',
      // width: 200,
    },
    {
      title: 'Lịch học',
      dataIndex: 'maHoaLichHoc',
      align: 'center',
      render: (val: string) => {
        if (!val) return <div>Chưa cập nhật</div>;
        const objLichHoc: DangKyTinChi.LichHoc[] = JSON.parse(val) || [];
        return objLichHoc?.map((item, index) => (
          <div key={index}>
            <span>Thứ: {Number(item.thu) !== 6 ? Number(item.thu) + 2 : 'Chủ nhật'}</span>
            <Divider type="vertical" />
            <span>Tiết bắt đầu: {item.tietBatDau}</span>
            <Divider type="vertical" />
            <span>Số tiết: {item.soTiet}</span>
            <div>Danh sách tuần: {item.danhSachTuan}</div>
          </div>
        ));
      },
    },
  ];

  const columnsNhomLop: IColumn<DangKyTinChi.NhomLopTinChi>[] = [
    {
      title: 'Đăng ký',
      dataIndex: 'soThuTuKyHoc',
      render: (val, recordNhomLop) => (
        <Checkbox
          checked={!!danhSachLopDaChon?.find((item) => item.idNhomLop === recordNhomLop?.idNhomLop)}
          onChange={(value) => onSelectNhomLopTinChi(value, recordNhomLop)}
        />
      ),
      width: 100,
      align: 'center',
    },
    {
      title: 'STT nhóm',
      dataIndex: 'soThuTuNhomLop',
      align: 'center',
      width: 200,
    },
    {
      title: 'Tổng số sinh viên',
      dataIndex: 'tongSoSinhVienNhomLop',
      align: 'center',
      width: 200,
    },
    {
      title: 'Sĩ số tối đa',
      dataIndex: 'siSoNhomLop',
      align: 'center',
      width: 200,
    },
    {
      title: 'Loại nhóm',
      dataIndex: 'loaiNhom',
      align: 'center',
      width: 100,
    },
    {
      title: 'Lịch học',
      dataIndex: 'maHoaLichHoc',
      align: 'center',
      render: (val: string) => {
        if (!val) return <div>Chưa cập nhật</div>;
        const objLichHoc: DangKyTinChi.LichHoc[] = JSON.parse(val) || [];
        return objLichHoc?.map((item, index) => (
          <div key={index}>
            <span>Thứ: {Number(item.thu) !== 6 ? Number(item.thu) + 2 : 'Chủ nhật'}</span>
            <Divider type="vertical" />
            <span>Tiết bắt đầu: {item.tietBatDau}</span>
            <Divider type="vertical" />
            <span>Số tiết: {item.soTiet}</span>
            <div>Danh sách tuần: {item.danhSachTuan}</div>
          </div>
        ));
      },
    },
  ];

  useEffect(() => {
    getDotDangKyTinChiByKyHocModel(record?.id);
    getThongTinKyHocModel(record?.id);
    return () => {
      setDanhSachNhomLopTinChi([]);
      setDanhSachLopTinChi([]);
    };
  }, [record?.id]);

  useEffect(() => {
    getDSLopDaDangKyByIdDotModel();
  }, [recordDotTinChi?.id]);
  useEffect(() => {
    const danhSach: LopDaChon[] = [];
    danhSachLopDaDangKy.forEach((lop) => {
      for (let i = 0; i < props?.danhSachTatCaHocPhan?.length; i += 1) {
        const hocPhan = props?.danhSachTatCaHocPhan?.[i];
        if (lop.hocPhanId === hocPhan?.idHocPhan) {
          danhSach.push({
            idNhomLop: lop.idNhomLopTinChi,
            soThuTuNhomLop: lop.soThuTuNhom === 0 ? undefined : lop.soThuTuNhom,
            tongSoSinhVienNhomLop: 0,
            siSoNhomLop: 0,
            loaiNhom: '',
            idHocPhan: lop.hocPhanId,
            maMonHoc: hocPhan?.maMonHoc ?? '',
            soThuTuKyHoc: 0,
            soTinChi: hocPhan?.soTinChi ?? 0,
            tenMonHoc: lop.hocPhan,
            hocPhi: hocPhan?.hocPhi ?? 0,
            tenGiangVien: '',
            soThuTuLop: lop.soThuTuLop,
            idLop: lop.idLopTinChi,
            tongSoSinhVienLop: 0,
            siSoLop: 0,
            soLuongNhom: 0,
            maHoaLichHoc: '',
          });
          break;
        }
      }
    });
    setDanhSachLopDaChon(danhSach);
  }, [danhSachLopDaDangKy.length]);
  return (
    <div>
      {recordDotTinChi === null && (
        <div>
          <Result
            title="Chưa có đợt đăng ký cho kỳ này"
            // extra={<Button type="primary">Back Home</Button>}
          />
        </div>
      )}
      {recordDotTinChi?.id && (
        <div>
          <>
            <InfoDot
              ngayBatDau={recordDotTinChi.ngay_bat_dau_tin_chi}
              ngayKetThuc={recordDotTinChi.ngay_ket_thuc_tin_chi}
            />
            <Row gutter={[8, 24]}>
              {checkTimeDangKy && (
                <>
                  <Col xs={24}>
                    <Scrollbars style={{ height: '300px' }}>
                      <TableDanhSachHocPhan data={data} columns={columns} />
                    </Scrollbars>
                  </Col>

                  {recordHocPhanCurrent?.idHocPhan && (
                    <Col span={24}>
                      <Table
                        loading={loading}
                        pagination={false}
                        title={() => <b>Danh sách lớp tín chỉ</b>}
                        dataSource={danhSachLopTinChi}
                        columns={columnsLopTinChi}
                      />
                    </Col>
                  )}
                  {danhSachNhomLopTinChi?.length > 0 && (
                    <Col span={24}>
                      <Table
                        loading={loading}
                        pagination={false}
                        title={() => <b>Danh sách nhóm</b>}
                        dataSource={danhSachNhomLopTinChi}
                        columns={columnsNhomLop}
                      />
                    </Col>
                  )}
                </>
              )}
              <Col xs={24}>
                <TableDanhSachHocPhanDaChon
                  checkTime={checkTimeDangKy}
                  danhSachHocPhanDaChon={danhSachLopDaChon?.map((item, index) => {
                    return { ...item, index: index + 1 };
                  })}
                  tongSoTinChi={tongSoTinChi}
                  tongHocPhi={tongHocPhi}
                  columns={columnsLopDaChon}
                />
              </Col>
            </Row>
            <br />
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() => {
                  setCurrent(0);
                }}
                type="primary"
                icon={<ArrowLeftOutlined />}
              >
                Quay lại
              </Button>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default TinChi;
