import usePostData from "@/hooks/usePostData";
import { ICreateSupplierProduct } from "@/models/productInterface";
import { fetchSuppliers } from "@/redux/store/slices/productSlices/get_supplier.slice";
import { AppDispatch } from "@/redux/store/store";
import productService from "@/services/productService";
import { Button, Form, Input, Modal, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  ID: string;
};

export default function ModalUpdateSupplier({ ID }: Props) {
  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    const res = await productService.getSupplierById(ID);
    if (res.statusCode === 200) {
      form.setFieldsValue(res.data);
    }
  };

  const handleSubmit = async (values: ICreateSupplierProduct) => {
    const res = await postdata(() => productService.updateSupplier(ID, values));
    if (res === 200 || res === 201) {
      dispatch(fetchSuppliers());
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật nhà cung ứng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin nhà cung ứng" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="name"
                label="Tên nhà cung ứng"
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Vui lòng nhập tên nhà cung ứng",
                  },
                ]}
                style={{ minWidth: "100%", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                style={{ width: "320px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Số điện thoại"
                style={{ width: "320px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                style={{ width: "320px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                style={{ width: "100%" }}
              >
                <Input.TextArea
                  placeholder="Description"
                  autoSize={{ minRows: 3 }}
                />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Cập nhật
          </Button>
        </div>
      </Modal>
    </>
  );
}
