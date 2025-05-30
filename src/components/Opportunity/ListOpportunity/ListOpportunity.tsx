import {
  IGetOpportunitiesDto,
  IUpdateOpportunitiesDto,
} from "@/models/opportunityInterface"; // Updated import
import { Button, Input, Modal, Select, Table, TableColumnsType, Tag } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { Ref, useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import ModalUpdateOpportunity from "../Tool/ModalOpportunity/ModalUpdateOpportunity";
import usePostData from "@/hooks/usePostData";
import { useDispatch } from "react-redux";
import opportunityService from "@/services/opportunityService.";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";
import { MdDeleteForever } from "react-icons/md";
import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";
import ModalAddPriceQuote from "@/components/PriceQuote/Tool/Modal/ModalPriceQuote";

export default function ListOpportunities() {
  // const { postdata } = usePostData();
  // const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole([
    "admin-top",
    "opportunity",
    "opportunity-edit",
  ]);
  const [idOpportunity,setIdOpportunity] = useState<string>("")
  const [reason,setReason] = useState<string>("")
  const [seeReason,setSeeReason] = useState<string>("")
  const refBtnPriceQuote = useRef<HTMLButtonElement>()
  const [statusPause,setStatusPause] = useState<string>("")
  const [statusCancel,setStatusCancel] = useState<string>("")
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_opportunities
  );

  const [pageLimit, setPageLimit] = useState<number>(25);
  const [dataFilter, setDataFilter] = useState<IGetOpportunitiesDto[] | []>();
  const handleSubmit = async (id: string, values: IUpdateOpportunitiesDto) => {
    try {
      const statusCode = await postdata(() =>
        opportunityService.updateOpportunity(id, values)
      );
      if (statusCode === 200) {
        dispatch(fetchOpportunities({}));
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  
  const columns: TableColumnsType<IGetOpportunitiesDto> = [
    {
      title: "#",
      className: "",
      dataIndex: "opportunity_id",
      render: (value: string, record, index) => (
        <div className="flex flex-col gap-1">
          <strong>#{index + 1}</strong>
          <div className="flex flex-wrap w-96">
            {/* <Button type="text" ghost className=" text-blue-600">
              View
            </Button> */}
            {isAuthorized && (
              <>
              <Button type="link" ghost className="text-xs text-blue-600 w-fit" onClick={()=>{
                setIdOpportunity(value)
                if(refBtnPriceQuote.current)
                refBtnPriceQuote?.current.click()
              }}>
              Báo giá
            </Button>
                <ModalUpdateOpportunity ID={value} />
                
                {record.status !== "success" && (
                  <>
                  
                  <Button
                    type="link"
                    className="w-fit"
                    onClick={() => {
                      handleSubmit(value, { status: "success" });
                    }}
                  >
                    Chuyển đổi khách hàng
                  </Button>

                  
                  <Button
                    type="link"
                    hidden={record.status === "pause" || record.status === "cancel"}
                    className="w-fit text-yellow-400 text-xs font-semibold"
                    onClick={() => {
                      // handleSubmit(value, { status: "success" });
                      setStatusPause(value)
                    }}
                  >
                    Tạm dừng
                  </Button>

                  <Button
                    type="link"
                    hidden={record.status === "pause" ?false :true || record.status === "cancel"}
                    className="w-fit text-green-500 text-xs font-semibold"
                    onClick={() => {
                      handleSubmit(value,{status:'pending'})
                    }}
                  >
                    Tiếp tục
                  </Button>
                  <Button
                    type="link"
                    hidden={record.status === "cancel"}
                    className="w-fit text-red-500 text-xs font-semibold"
                    onClick={() => {
                      // handleSubmit(value, { status: "success" });
                      setStatusCancel(value)
                    }}
                  >
                    Thất bại
                  </Button>
                  <Button
                    type="link"
                    hidden={(record.status === "cancel" || record.status === "pause")?false : true}
                    className="w-fit text-indigo-500 text-xs font-semibold"
                    onClick={() => {
                      // handleSubmit(value, { status: "success" });
                      setSeeReason(record?.reason ?? "")
                      
                    }}
                  >
                    Lý do
                  </Button>
                  </>
                
                  
                )}

              </>
            )}
          </div>
        </div>
      ),
      sorter: (a, b) => a.opportunity_id.localeCompare(b.opportunity_id),
    },
    {
      title: "Tên liên hệ",
      className: "",
      dataIndex: "name_contact",
      render: (value: string | undefined) =>
        value && value.length > 15 ? `${value.slice(0, 15)}...` : value,
      sorter: (a, b) =>
        (a.name_contact || "").localeCompare(b.name_contact || ""),
    },
    {
      title: "Công ty",
      className: "",
      dataIndex: "company_name",
      sorter: (a, b) =>
        (a.company_name || "").localeCompare(b.company_name || ""),
      render: (value) => <>{value}</>,
    },
    {
      title: "Email",
      className: "",
      dataIndex: "email",
      sorter: (a, b) =>
        (a.company_name || "").localeCompare(b.company_name || ""),
      render: (value) => <>{value}</>,
    },
    {
      title: "Số điện thoại",
      className: "",
      dataIndex: "phone_number",
      sorter: (a, b) =>
        (a.company_name || "").localeCompare(b.company_name || ""),
      render: (value) => <>{value}</>,
    },
    {
      title: "Nhân viên hỗ trợ",
      className: "",
      dataIndex: ["user_support"], // Specify the main object to access nested properties
      sorter: (a, b) =>
        (a.user_support?.last_name || "").localeCompare(
          b.user_support?.last_name || ""
        ),
      render: (user) => (
        <>
          {user?.first_name} {user?.last_name}
        </>
      ),
    },

    {
      title: "Tình trạng",
      className: "",
      dataIndex: ["status"],
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      render: (value: string) => (
        <>
          <Tag
            color={
              value === "cancel"
                ? "gray"
                : value === "send"
                ? "blue"
                : value === "pending"
                ? "blue-inverse"
                : value === "delete"
                ? "red"
                : value === "success"
                ? "green"
                : value === "pause"
                ? "yellow"
                : ""
            }
            
          >
            {(value === "cancel"
              ? "Đã hủy"
              : value === "hide"
              ? "Đang ẩn"
              : value === "pending"
              ? "Đang chờ"
              : value === "delete"
              ? "Đã xóa"
              : value === "success"
              ? "Thành công"
              : value === "send"
              ? "Đã gửi báo giá"
              : value === "pause"
              ? "Tạm dừng"
              : ""
            )}
          </Tag>
        </>
      ),
    },
    {
      title: "Nguồn cơ hội",
      className: "",
      dataIndex: ["type_source", "name"],
      sorter: (a, b) =>
        (a.company_name || "").localeCompare(b.company_name || ""),
      render: (value) => <>{value}</>,
    },

    {
      title: "Ngày tạo",
      className: "",
      dataIndex: "created_at",
      render: (value: Date) => new Date(value).toLocaleDateString("vi-VN"),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
  ];

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((dt) => {
        return String(
          dt.opportunity_id +
            " " +
            dt.name_contact +
            " " +
            dt.company_name +
            " " +
            dt.price
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetOpportunitiesDto> = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IGetOpportunitiesDto[]
    ) => {
      setListSelect(selectedRows.map((dt) => dt.opportunity_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      opportunityService.deleteOpportunities(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchOpportunities({}));
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
  };
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (dataSource && id) {
      handleSearchFilter(id);
    } else {
      setDataFilter(
        dataSource.map((dt, index) => {
          return { ...dt, key: index };
        })
      );
    }
  }, [dataSource, searchParams]);
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageLimit}
            style={{ width: 83 }}
            onChange={(e) => setPageLimit(e)}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 100000000, label: "All" },
            ]}
          />
          <Button hidden={!(listSelect.length > 0)}>Xuất ra</Button>
          <Button
            onClick={() => {
              setIsModalConfirmDelete(true);
            }}
            danger
            hidden={!(listSelect.length > 0)}
            className="text-xl"
            icon={<MdDeleteForever />}
          />
          <Modal
            open={isModalConfirmDelete}
            title={"Xóa dữ liệu"}
            onOk={handleDelete}
            onCancel={() => {
              setIsModalConfirmDelete(false);
            }}
          >
            Bạn có chắc chắn muốn xóa không ?
          </Modal>
        </div>
        <div className="flex items-center">
          <Search
            onChange={(e) => handleSearchFilter(e.target.value)}
            placeholder="Search"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetOpportunitiesDto>
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataFilter}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageLimit,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </div>
      </div>
      <ModalAddPriceQuote idOpportunity={idOpportunity} refBtn={refBtnPriceQuote as Ref<HTMLButtonElement>}/>
        <Modal
          open={(statusCancel !== "" || statusPause !== "")}
          title={statusCancel !== ""?'Lý do thất bại':'Lý do tạm dừng'}
          onOk={()=>{
            const id = statusCancel === ""?statusPause:statusCancel
            if(statusPause === ""){
              handleSubmit(id,{status:'cancel',reason})
              setStatusCancel("")
            }else{
              handleSubmit(id,{status:'pause',reason})
              setStatusPause("")

            }
          }}
          onCancel={()=>{
            setStatusCancel("")
            setStatusPause("")
          }}
        >
           <Input.TextArea
                  placeholder="Lý do"
                  onChange={(e)=>{
                    setReason(e.target.value)
                  }}
                  autoSize={{ minRows: 5 }}
                />
        </Modal>
        <Modal
          open={(seeReason !== "" )}
          title={'Lý do'}
          onCancel={()=>{setSeeReason("")}}
          footer={false}
        >
           <Input.TextArea
                  value={seeReason}
                  autoSize={{ minRows: 5 }}
                />
        </Modal>
    </div>
  );
}
