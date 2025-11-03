/* eslint-disable no-unused-vars */
// src/pages/Coupon/UpdateCouponPage.jsx
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../utils/axios"; // ✅ Axios instance

const UpdateCouponPage = () => {
  const { id } = useParams(); // id varsa güncelleme
  const isUpdate = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Kuponu çek
  const fetchCoupon = async () => {
    if (!isUpdate) return; // id yoksa oluşturma
    try {
      const res = await api.get("/api/coupons");
      const coupon = res.data.coupons.find((c) => c._id === id);
      if (coupon) {
        form.setFieldsValue({
          code: coupon.code,
          discount: coupon.discount,
          expirationDate: dayjs(coupon.expirationDate),
        });
      } else {
        message.error("Kupon bulunamadı");
      }
    } catch {
      message.error("Kupon bilgisi alınamadı");
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isUpdate) {
        // Güncelleme
        await api.put(`/api/coupons/${id}`, {
          code: values.code,
          discount: values.discount,
          expirationDate: values.expirationDate.toISOString(),
        });
        message.success("Kupon başarıyla güncellendi");
      } else {
        // Yeni oluşturma
        await api.post(`/api/coupons`, {
          code: values.code,
          discount: values.discount,
          expirationDate: values.expirationDate.toISOString(),
        });
        message.success("Kupon başarıyla oluşturuldu");
      }
      navigate("/admin/coupons");
    } catch (err) {
      message.error(isUpdate ? "Kupon güncellenemedi" : "Kupon oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>{isUpdate ? "Kupon Güncelle" : "Yeni Kupon Oluştur"}</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Kupon Kodu"
          name="code"
          rules={[{ required: true, message: "Kupon kodu zorunludur" }]}
        >
          <Input placeholder="Örn: YENI15" />
        </Form.Item>

        <Form.Item
          label="İndirim (%)"
          name="discount"
          rules={[{ required: true, message: "İndirim oranı zorunludur" }]}
        >
          <InputNumber min={1} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Bitiş Tarihi"
          name="expirationDate"
          rules={[{ required: true, message: "Tarih zorunludur" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          {isUpdate ? "Güncelle" : "Oluştur"}
        </Button>
      </Form>
    </div>
  );
};

export default UpdateCouponPage;
