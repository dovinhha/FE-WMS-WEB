import React, { useState, useEffect, useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Input,
} from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import SimpleHeader from "./components/Header";
import ModalWarningCustom from "views/pages/components/ModalWarningCustom";
import { EditSVG, DeleteSVG, ViewSVG } from "assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { warehouseActions } from "Redux/Actions";
import queryString from "query-string";
import _ from "lodash";
import { notify } from "common";
import FormWarehouseDefinition from "./FormWarehouseDefinition";
import ReactNotificationAlert from "react-notification-alert";
const WarehouseDefinition = () => {
  const dispatch = useDispatch();
  const { warehouses, isDeleteWarehouse, isGetWarehouses } = useSelector(
    (state) => state.warehouseReducer
  );

  const notificationAlertRef = useRef(null);
  const [warehouse, setWarehouse] = useState({});
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState({
    page: page,
    limit: rowsPerPage,
  });

  const boxAction = (cell, row) => {
    return (
      <>
        <button
          style={{
            padding: 0,
            border: "none",
            marginRight: ".5rem",
            background: "none",
          }}
          id="view"
          onClick={() => {}}
        >
          <ViewSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="view">
          Xem chi tiết
        </UncontrolledTooltip>
        <button
          style={{
            padding: 0,
            border: "none",
            marginRight: ".5rem",
            background: "none",
          }}
          id="edit"
          onClick={() => {
            setFormModal(true);
            setIsModalAdd(false);
            setWarehouse(row);
          }}
        >
          <EditSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="edit">
          Cập nhật thông tin định nghĩa kho
        </UncontrolledTooltip>
        <button
          id="delete"
          onClick={() => {
            setNotificationModal(true);
            setWarehouse(row);
          }}
          style={{ padding: 0, border: "none", background: "none" }}
        >
          <DeleteSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="delete">
          Xóa định nghĩa kho
        </UncontrolledTooltip>
      </>
    );
  };
  const columns = [
    {
      dataField: "code",
      text: "Mã kho",
    },
    {
      dataField: "name",
      text: "Tên kho",
    },
    {
      dataField: "description",
      text: "Mô tả kho",
    },
    {
      dataField: "address",
      text: "Địa chỉ",
    },
    {
      dataField: "actions",
      text: "Hành động",
      formatter: boxAction,
    },
  ];

  const onSizePerPageChange = (value) => {
    setRowsPerPage(value);
    setPage(1);
    setQuery({ ...query, page: 1, limit: value });
  };

  const pagination = paginationFactory({
    page: page,
    onPageChange: (value) => {
      setPage(value);
      setQuery({ ...query, page: value });
    },
    sizePerPage: rowsPerPage,
    totalSize: warehouses?.totalResults,
    showTotal: false,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: () => (
      <>
        <Col>
          <p>
            Hiển thị từ {(page - 1) * rowsPerPage + 1} đến{" "}
            {page * rowsPerPage > warehouses.items.length
              ? !isNaN(warehouses?.totalResults)
                ? warehouses.totalResults
                : 0
              : page * rowsPerPage}{" "}
            trong số{" "}
            {!isNaN(warehouses?.totalResults) ? warehouses.totalResults : 0} bản
            ghi
          </p>
        </Col>
      </>
    ),
  });

  const handleDelete = () => {
    dispatch(
      warehouseActions.deleteWarehouse(warehouse.id, {
        success: () => {
          setNotificationModal(false);
          notify(
            notificationAlertRef,
            "success",
            "Thông báo",
            `Xóa định nghĩa kho thành công!`
          );
          handleGetWarehouses();
        },
        failed: (mess) => {
          notify(
            notificationAlertRef,
            "danger",
            "Thông báo",
            `Xóa định nghĩa kho thất bại. Lỗi: ${mess}!`
          );
        },
      })
    );
  };

  const handleGetWarehouses = () => {
    dispatch(warehouseActions.getWarehouses(queryString.stringify(query)));
  };

  useEffect(() => {
    handleGetWarehouses();
  }, [query]);

  return (
    <>
      <div className="rna-wrapper">
        <ReactNotificationAlert ref={notificationAlertRef} />
      </div>
      {notificationModal && (
        <ModalWarningCustom
          notificationModal={notificationModal}
          setNotificationModal={setNotificationModal}
          name="định nghĩa kho"
          func={handleDelete}
          isDelete={isDeleteWarehouse}
        />
      )}
      {formModal && (
        <FormWarehouseDefinition
          isModalAdd={isModalAdd}
          formModal={formModal}
          setFormModal={setFormModal}
          id={warehouse?.id}
          handleGetWarehouses={handleGetWarehouses}
          notificationAlertRef={notificationAlertRef}
        />
      )}
      <SimpleHeader
        name="Cài đặt định nghĩa kho"
        parentName="Quản lý"
        setFormModal={setFormModal}
        setIsModalAdd={setIsModalAdd}
        setWarehouse={setWarehouse}
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card style={{ overflowX: "scroll" }}>
              <ToolkitProvider
                data={warehouses.items}
                keyField="id"
                columns={columns}
                search
              >
                {(props) => (
                  <>
                    {isGetWarehouses ? (
                      <Row className="align-items-center ">
                        <Col
                          md="12"
                          className="d-flex justify-content-center p-5"
                        >
                          <div className="spinner-border text-info" />
                        </Col>
                      </Row>
                    ) : (
                      <>
                        <Row>
                          <Col>
                            <CardHeader>
                              <h3 className="mb-0">Danh sách định nghĩa kho</h3>
                            </CardHeader>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <CardHeader>
                              <div className="mb-0 d-flex align-items-center">
                                <p className="mb-0">Hiển thị </p>
                                {
                                  <select
                                    value={rowsPerPage}
                                    name="datatable-basic_length"
                                    aria-controls="datatable-basic"
                                    className="form-control form-control-sm mx-2"
                                    style={{ maxWidth: 60 }}
                                    onChange={(e) =>
                                      onSizePerPageChange(e.target.value)
                                    }
                                  >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                  </select>
                                }{" "}
                                <p className="mb-0">dòng</p>
                              </div>
                            </CardHeader>
                          </Col>
                          <Col className="d-flex align-items-center mr-4 justify-content-end">
                            <Row style={{ width: "100%" }}>
                              <Col
                                md={6}
                                className="d-flex align-items-center justify-content-end"
                              >
                                <h4 className="mb-0">
                                  Tìm kiếm tên định nghĩa kho
                                </h4>
                              </Col>
                              <Col md={6} className="d-flex align-items-center">
                                <Input
                                  id="search-by-name"
                                  placeholder="Nhập tên"
                                  type="text"
                                  onChange={() => {}}
                                  // value={""}
                                  className="py-0"
                                  bsSize="sm"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <BootstrapTable
                          {...props.baseProps}
                          noDataIndication={() => {
                            return (
                              <span className="font-weight-bold text-danger">
                                Không có dữ liệu!
                              </span>
                            );
                          }}
                          hover
                          remote
                          filter={filterFactory()}
                          bootstrap4={true}
                          pagination={pagination}
                          bordered={false}
                        />
                      </>
                    )}
                  </>
                )}
              </ToolkitProvider>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default WarehouseDefinition;
