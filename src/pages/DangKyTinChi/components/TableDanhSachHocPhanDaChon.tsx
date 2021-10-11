import TableTemp from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const TableDanhSachHocPhanDaChon = (props: {
  danhSachHocPhanDaChon: any[];
  columns: IColumn<any>[];
  tongSoTinChi: number;
  tongHocPhi: number;
  checkTime: boolean;
}) => {
  const {
    recordDotNhuCau,
    recordThongTinKyHoc,
    postDanhSachHocPhanDangKyModel,
    current,
    postDanhSachLopDangKyModel,
  } = useModel('dangkytinchi');
  const checkTrongThoiGianDangKy =
    moment(recordDotNhuCau?.ngay_bat_dau_nhu_cau)?.isBefore(moment(new Date())) &&
    moment(new Date()).isBefore(moment(recordDotNhuCau?.ngay_ket_thuc_nhu_cau));
  let textConfirmSave = 'Bạn có chắc chắn muốn lưu không ?';
  if (props.tongSoTinChi < recordThongTinKyHoc.tinChiDangKyToiThieu) {
    textConfirmSave = `Bạn đã đăng ký số tín chỉ ít hơn ${recordThongTinKyHoc.tinChiDangKyToiThieu} tín chỉ theo quy định. Bạn có chắc chắn muốn tiếp tục đăng ký không?`;
  } else if (props.tongSoTinChi > recordThongTinKyHoc.tinChiDangKyToiDa) {
    textConfirmSave = `Bạn đã đăng ký số tín chỉ lớn hơn ${recordThongTinKyHoc.tinChiDangKyToiDa} tín chỉ theo quy định. Bạn vui lòng đăng ký lại`;
  }
  const onSave = () => {
    if (props.tongSoTinChi > recordThongTinKyHoc.tinChiDangKyToiDa) return;

    const danhSachHocPhan: any = props.danhSachHocPhanDaChon?.map((item) => {
      if (current === 0) return { idHocPhan: item.idHocPhan };
      return {
        lop_tin_chi_id: item?.idLop,
        nhom_lop_tin_chi_id: item?.idNhomLop,
      };
    });
    if (current === 0) postDanhSachHocPhanDangKyModel(danhSachHocPhan);
    else postDanhSachLopDangKyModel({ data: { danhSachLop: danhSachHocPhan } });
  };

  return (
    <TableTemp
      title={
        <b>
          <span>Danh sách học phần đã chọn</span>
          {props.checkTime && (
            <span style={{ float: 'right' }}>
              <Popconfirm
                disabled={props.danhSachHocPhanDaChon.length === 0 || !checkTrongThoiGianDangKy}
                onConfirm={onSave}
                title={<div style={{ maxWidth: 300 }}>{textConfirmSave}</div>}
              >
                <Button
                  icon={<SaveOutlined />}
                  style={{ marginRight: '-16px' }}
                  disabled={props.danhSachHocPhanDaChon.length === 0 || !checkTrongThoiGianDangKy}
                  type="primary"
                >
                  Lưu
                </Button>
              </Popconfirm>
            </span>
          )}
        </b>
      }
      columns={[
        {
          title: 'STT',
          width: 80,
          align: 'center',
          dataIndex: 'index',
        },
        ...props.columns.slice(1),
      ]}
      data={
        props.danhSachHocPhanDaChon.length > 0
          ? [
              ...props.danhSachHocPhanDaChon,
              {
                index: ' ',
                tenMonHoc: 'Tổng',
                soTinChi: props.tongSoTinChi,
                soThuTuKyHoc: props.tongSoTinChi,
                idHocPhan: -1,
                maMonHoc: '',
                hocPhi: props.tongHocPhi,
              },
            ]
          : props.danhSachHocPhanDaChon
      }
    />
  );
};

export default TableDanhSachHocPhanDaChon;
