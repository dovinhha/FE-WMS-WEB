import React, { useState, useEffect, useRef } from "react";
import { AddSVG } from "assets/svg";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import InputCustom from "views/pages/components/InputCustom";
import Select from "react-select";
import {
  customerActions,
  productActions,
  orderActions,
  accountActions,
} from "Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import moment from "moment";
import ReactNotificationAlert from "react-notification-alert";
import { notify } from "common";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import Error from "views/pages/components/Error";
import _ from "lodash";

const OrderInfor = ({ handleChangeTab, orderById }) => {
  const orderSchema = yup.object().shape({
    code: yup.string().required("Mã đơn hàng không được để trống!"),
    name: yup.string().required("Tên đơn hàng không được để trống!"),
    manager: yup.string().required("Vui lòng chọn chủ nhiệm quản lý!"),
    notes: yup.string().required("Ghi chú không được để trống!"),
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const { accounts } = useSelector((state) => state.accountReducer);
  const { products } = useSelector((state) => state.productReducer);
  const { customers } = useSelector((state) => state.customerReducer);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerValue, setCustomerValue] = useState({});
  const [productTypesSearch, setProductSearch] = useState("");
  const notificationAlertRef = useRef(null);
  const [accountValue, setAccountValue] = useState({});
  const [accountSearch, setAccountSearch] = useState("");
  const [errorProducts, setErrorProducts] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    code: "",
    name: "",
    manager: "",
    products: [
      {
        productValue: {},
        productTypeId: "",
        amount: "",
      },
    ],
    startDate: moment(),
    endDate: moment(),
    guaranteeDate: moment(),
    actualDate: moment(),
    notes: "",
  });
  const [changed, setChanged] = useState({
    manager: false,
  });
  const handleGetAccounts = () => {
    if (accountSearch === "") {
      dispatch(
        accountActions.getAccounts(queryString.stringify({ status: "active" }))
      );
    } else {
      dispatch(
        accountActions.getAccounts(
          queryString.stringify({ status: "active", name: accountSearch })
        )
      );
    }
  };

  const handleGetProducts = () => {
    if (productTypesSearch === "") {
      dispatch(
        productActions.getProducts(queryString.stringify({ status: "active" }))
      );
    } else {
      dispatch(
        productActions.getProducts(
          queryString.stringify({
            status: "active",
            name: productTypesSearch,
          })
        )
      );
    }
  };

  const handleGetCustomers = () => {
    if (customerSearch === "") {
      dispatch(
        customerActions.getCustomers(
          queryString.stringify({ status: "active" })
        )
      );
    } else {
      dispatch(
        customerActions.getCustomers(
          queryString.stringify({
            status: "active",
            name: customerSearch,
          })
        )
      );
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetAccounts();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [accountSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetProducts();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [productTypesSearch]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetCustomers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [customerSearch]);

  const clearData = () => {
    setOrderInfo({
      code: "",
      name: "",
      manager: "",
      products: [
        {
          productValue: {},
          productTypeId: "",
          amount: "",
        },
      ],
      startDate: moment(),
      endDate: moment(),
      guaranteeDate: moment(),
      actualDate: moment(),
      notes: "",
    });
    setAccountValue({});
  };

  const onSubmit = (values) => {
    delete values.customerOrganizationId;
    dispatch(
      orderActions.updateOrder(
        {
          ...values,
          products: values.products.map((item) => ({
            productTypeId: item.productTypeId,
            amount: item.amount,
            price: item.price,
          })),
        },
        orderById.id,
        {
          success: () => {
            notify(
              notificationAlertRef,
              "success",
              "Thông báo",
              `Cập nhật đơn hàng thành công!`
            );
          },
          failed: (mess) => {
            notify(
              notificationAlertRef,
              "danger",
              "Thông báo",
              `Cập nhật đơn hàng thất bại. Lỗi: ${mess}`
            );
          },
        }
      )
    );
  };

  useEffect(() => {
    if (!_.isEmpty(orderById)) {
      const tempOrderDetails = [];
      orderById.orderDetails.forEach((item) => {
        const tempListProduct = item.listProduct.map((val) => ({
          amount: val.amount,
          productTypeId: val.productTypeId.id,
        }));
        tempOrderDetails.push({
          customerOrganizationId: item.customerOrganizationId,
          listProduct: tempListProduct,
        });
      });
      setOrderInfo({
        code: orderById.code,
        name: orderById.name,
        manager: orderById.manager.id,
        products: orderById.products.map((item) => ({
          productValue: {
            label: item.productTypeId.name,
            value: item.productTypeId.id,
          },
          productTypeId: item.productTypeId.id,
          amount: item.amount,
          price: item.price,
        })),
        startDate: orderById.startDate,
        endDate: orderById.endDate,
        guaranteeDate: orderById.guaranteeDate,
        actualDate: orderById.actualDate,
        notes: orderById.notes,
        customerOrganizationId: orderById.customerOrganizationId.id,
        orderDetails: tempOrderDetails,
        customerIds: orderById.customerIds,
      });
      setCustomerValue({
        label: orderById.customerOrganizationId.name,
        value: orderById.customerOrganizationId.id,
      });
      setAccountValue({
        value: orderById.manager.id,
        label: orderById.manager.name,
      });
    }
  }, [orderById]);

  return (
    <>
      <div className="rna-wrapper">
        <ReactNotificationAlert ref={notificationAlertRef} />
      </div>
      <Formik
        initialValues={orderInfo}
        enableReinitialize
        onSubmit={onSubmit}
        validationSchema={orderSchema}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
          handleBlur,
          setFieldTouched,
        }) => {
          return (
            <>
              <Row>
                <Col xs={7} style={{ borderRight: "1px solid #BABCBE" }}>
                  <Row>
                    <Col xs={3} className="h4 font-weight-400 ">
                      Mã đơn hàng
                    </Col>
                    <Col xs={9}>
                      <FormGroup>
                        <InputCustom
                          style={{ maxWidth: 300 }}
                          placeholder="AD123456"
                          type="text"
                          name="code"
                          id="code"
                          onBlur={handleBlur}
                          invalid={touched.code && errors.code}
                          onChange={(e) => {
                            setFieldValue("code", e.target.value);
                          }}
                          messageInvalid={errors.code}
                          value={values.code}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={3} className="h4 font-weight-400">
                      Tên đơn hàng
                    </Col>
                    <Col xs={9}>
                      <FormGroup>
                        <InputCustom
                          placeholder="Nhập tên"
                          type="text"
                          name="name"
                          id="name"
                          onBlur={handleBlur}
                          invalid={errors.name && touched.name}
                          onChange={(e) => {
                            // setOrderInfo({
                            //   ...orderInfo,
                            //   name: e.target.value,
                            // });
                            setFieldValue("name", e.target.value);
                          }}
                          messageInvalid={errors.name}
                          value={values.name}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col xs={3} className="h4 font-weight-400">
                      Chủ nhiệm quản lý
                    </Col>
                    <Col xs={9}>
                      <Select
                        placeholder="Nhập tên tìm kiếm"
                        isClearable={true}
                        value={accountValue}
                        onChange={(e) => {
                          setAccountValue({ ...e });
                          setFieldValue("manager", e ? e.value : "");
                        }}
                        options={accounts.items.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        onInputChange={(value) => {
                          setAccountSearch(value);
                        }}
                        onFocus={() => {
                          setChanged({
                            ...changed,
                            manager: true,
                          });
                        }}
                      />
                      {changed.manager && errors.manager && (
                        <Error messageInvalid={errors.manager} />
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col xs={3} className="h4 font-weight-400">
                      Đơn vị
                    </Col>
                    <Col xs={9}>
                      <Select
                        isDisabled={true}
                        placeholder="Nhập tên tìm kiếm"
                        isClearable={true}
                        value={customerValue}
                        onChange={(e) => {
                          setCustomerValue({ ...e });
                          setFieldValue(
                            "customerOrganizationId",
                            e ? e.value : ""
                          );
                        }}
                        options={customers.items.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        onInputChange={(value) => {
                          setCustomerSearch(value);
                        }}
                        onFocus={() => {
                          setChanged({
                            ...changed,
                            customerOrganizationId: true,
                          });
                        }}
                      />
                      {changed.customerOrganizationId &&
                        errors.customerOrganizationId && (
                          <Error
                            messageInvalid={errors.customerOrganizationId}
                          />
                        )}
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col xs={3} className="h4 font-weight-400">
                      Ghi chú
                    </Col>
                    <Col md={9}>
                      <FormGroup>
                        <InputCustom
                          placeholder="Nhập ghi chú"
                          type="textarea"
                          rows="4"
                          name="notes"
                          id="notes"
                          onBlur={handleBlur}
                          invalid={errors.notes && touched.notes}
                          onChange={(e) => {
                            setFieldValue("notes", e.target.value);
                          }}
                          messageInvalid={errors.notes}
                          value={values.notes}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {values.products.map((item, index) => {
                    return (
                      <Row>
                        <Col md={12}>
                          <Row>
                            <Col xs={6}>
                              <label className="form-control-label">
                                Chọn sản phẩm
                              </label>
                              <Select
                                placeholder="Lựa chọn"
                                isClearable={true}
                                value={item.productValue}
                                onChange={(e) => {
                                  setFieldValue("products", [
                                    ...values.products.slice(0, index),
                                    {
                                      ...values.products[index],
                                      productTypeId: !!e ? e.value : "",
                                      productValue: { ...e },
                                    },
                                    ...values.products.slice(index + 1),
                                  ]);
                                }}
                                options={products.items.map((item) => ({
                                  value: item.id,
                                  label: item.name,
                                }))}
                                onInputChange={(value) => {
                                  setProductSearch(value);
                                }}
                              />
                            </Col>
                            <Col xs={3}>
                              <Row
                                className="mx-0 "
                                style={{ justifyContent: "flex-end" }}
                              >
                                <FormGroup>
                                  <InputCustom
                                    placeholder="Nhập"
                                    label="Đơn giá"
                                    type="number"
                                    onChange={(e) => {
                                      setFieldValue("products", [
                                        ...values.products.slice(0, index),
                                        {
                                          ...values.products[index],
                                          price:
                                            e.target.value === ""
                                              ? ""
                                              : Number(e.target.value),
                                        },
                                        ...values.products.slice(index + 1),
                                      ]);
                                    }}
                                    value={item.price}
                                    style={{ maxWidth: 80 }}
                                  />
                                </FormGroup>
                              </Row>
                            </Col>
                            <Col xs={3}>
                              <Row
                                className="mx-0 "
                                style={{ justifyContent: "flex-end" }}
                              >
                                <FormGroup>
                                  <InputCustom
                                    placeholder="AD123456"
                                    label="Số lượng may"
                                    type="number"
                                    onChange={(e) => {
                                      setFieldValue("products", [
                                        ...values.products.slice(0, index),
                                        {
                                          ...values.products[index],
                                          amount:
                                            e.target.value === ""
                                              ? ""
                                              : Number(e.target.value),
                                        },
                                        ...values.products.slice(index + 1),
                                      ]);
                                    }}
                                    value={item.amount}
                                    style={{ maxWidth: 80 }}
                                  />
                                </FormGroup>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                  <Row className="pr-3" style={{ justifyContent: "flex-end" }}>
                    <span
                      onClick={() => {
                        setFieldValue("products", [
                          ...values.products,
                          {
                            productTypeId: "",
                            amount: "",
                          },
                        ]);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <AddSVG />
                    </span>
                    <Col md="12">
                      {errorProducts && (
                        <Error messageInvalid="Vui lòng nhập đầy đủ thông tin dòng sản phẩm!" />
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col xs={5}>
                  <p className=" h5 text-muted text-uppercase">Thời gian</p>
                  <Row className="mb-4">
                    <Col xs={6}>
                      <p className="h5 font-weight-400">
                        Thời gian bắt đầu thực hiện
                      </p>
                      <Input
                        type="date"
                        value={moment(values.startDate).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setFieldValue("startDate", e.target.value);
                        }}
                      />
                    </Col>
                    <Col xs={6}>
                      <p className="h5 font-weight-400">Thời gian trả hàng</p>
                      <Input
                        type="date"
                        value={moment(values.endDate).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setFieldValue("endDate", e.target.value);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <p className="h5 font-weight-400">Thời gian bảo hành</p>
                      <Input
                        type="date"
                        value={moment(values.guaranteeDate).format(
                          "YYYY-MM-DD"
                        )}
                        onChange={(e) => {
                          setFieldValue("guaranteeDate", e.target.value);
                        }}
                      />
                    </Col>
                    <Col xs={6}>
                      <p className="h5 font-weight-400">
                        Thời gian hoàn thành chỉnh sửa
                      </p>
                      <Input
                        type="date"
                        value={moment(values.actualDate).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setFieldValue("actualDate", e.target.value);
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="text-md-right mt-3">
                <Button
                  onClick={() => {
                    history.push("/order-manage");
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  onClick={() => {
                    setChanged({
                      manager: true,
                    });
                    let check = false;
                    values.products.forEach((item) => {
                      if (item.productTypeId === "" || item.amount === "") {
                        check = true;
                      }
                    });
                    if (check) {
                      setErrorProducts(true);
                      return;
                    }

                    handleSubmit();
                  }}
                  color="primary"
                >
                  Lưu lại
                </Button>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default OrderInfor;
