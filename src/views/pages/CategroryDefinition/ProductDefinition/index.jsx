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
import { productActions } from "Redux/Actions";
import queryString from "query-string";
import _ from "lodash";
import { notify } from "common";
import FormProductDifinition from "./FormProductDifinition";
import ReactNotificationAlert from "react-notification-alert";
const Products = () => {
  const dispatch = useDispatch();
  const { products, isDeleteProduct, isGetProducts } = useSelector(
    (state) => state.productReducer
  );

  const notificationAlertRef = useRef(null);
  const [product, setProduct] = useState({});
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
        {/* <button
          style={{
            padding: 0,
            border: "none",
            marginRight: ".5rem",
            background: "none",
          }}
          id="view"
          onClick={() => {
            // setFormModal(true);
            // setIsModalAdd(false);
            // setProduct(row);
          }}
        >
          <ViewSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="view">
          Xem chi ti???t
        </UncontrolledTooltip> */}
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
            setProduct(row);
          }}
        >
          <EditSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="edit">
          C???p nh???t th??ng tin s???n ph???m
        </UncontrolledTooltip>
        <button
          id="delete"
          onClick={() => {
            setNotificationModal(true);
            setProduct(row);
          }}
          style={{ padding: 0, border: "none", background: "none" }}
        >
          <DeleteSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="delete">
          X??a s???n ph???m
        </UncontrolledTooltip>
      </>
    );
  };
  const columns = [
    {
      dataField: "code",
      text: "M?? s???n ph???m",
    },
    {
      dataField: "name",
      text: "T??n s???n ph???m",
    },
    {
      dataField: "code",
      text: "Ki???u s???n ph???m",
    },
    {
      dataField: "price",
      text: "Gi?? s???n ph???m",
    },
    {
      dataField: "itemUnit.name",
      text: "????n v??? t??nh",
    },
    {
      dataField: "itemType.name",
      text: "Ki???u s???n ph???m",
    },
    {
      dataField: "description",
      text: "M?? t???",
    },
    {
      dataField: "actions",
      text: "H??nh ?????ng",
      formatter: boxAction,
      style: {
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center",
      },
    },
    // {
    //   dataField: "name",
    //   text: "BOM",
    // },
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
    totalSize: products?.totalResults,
    showTotal: false,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: () => (
      <>
        <Col>
          <p>
            Hi???n th??? t??? {(page - 1) * rowsPerPage + 1} ?????n{" "}
            {page * rowsPerPage > products.items.length
              ? !isNaN(products?.totalResults)
                ? products.totalResults
                : 0
              : page * rowsPerPage}{" "}
            trong s???{" "}
            {!isNaN(products?.totalResults) ? products.totalResults : 0} b???n ghi
          </p>
        </Col>
      </>
    ),
  });

  const handleDelete = () => {
    dispatch(
      productActions.deleteProduct(product.id, {
        success: () => {
          setNotificationModal(false);
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `X??a s???n ph???m th??nh c??ng!`
          );
          handleGetProducts();
        },
        failed: (mess) => {
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `X??a s???n ph???m th???t b???i. L???i: ${mess}!`
          );
        },
      })
    );
  };

  const handleGetProducts = () => {
    dispatch(productActions.getProducts(queryString.stringify(query)));
  };

  useEffect(() => {
    handleGetProducts();
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
          name="s???n ph???m"
          func={handleDelete}
          isDelete={isDeleteProduct}
        />
      )}
      {formModal && (
        <FormProductDifinition
          isModalAdd={isModalAdd}
          formModal={formModal}
          setFormModal={setFormModal}
          product={product}
          handleGetProducts={handleGetProducts}
          notificationAlertRef={notificationAlertRef}
        />
      )}
      <SimpleHeader
        name="C??i ?????t s???n ph???m"
        parentName="Qu???n l??"
        setFormModal={setFormModal}
        setIsModalAdd={setIsModalAdd}
        setProduct={setProduct}
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card style={{ overflowX: "scroll" }}>
              <ToolkitProvider
                data={products.items}
                keyField="id"
                columns={columns}
                search
              >
                {(props) => (
                  <>
                    <Row>
                      <Col>
                        <CardHeader>
                          <h3 className="mb-0">Danh s??ch s???n ph???m</h3>
                        </CardHeader>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <CardHeader>
                          <div className="mb-0 d-flex align-items-center">
                            <p className="mb-0">Hi???n th??? </p>
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
                            <p className="mb-0">d??ng</p>
                          </div>
                        </CardHeader>
                      </Col>
                      <Col className="d-flex align-items-center mr-4 justify-content-end">
                        <Row style={{ width: "100%" }}>
                          <Col
                            md={6}
                            className="d-flex align-items-center justify-content-end"
                          >
                            <h4 className="mb-0">T??m ki???m t??n s???n ph???m</h4>
                          </Col>
                          <Col md={6} className="d-flex align-items-center">
                            <Input
                              id="search-by-name"
                              placeholder="Nh???p t??n"
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
                            Kh??ng c?? d??? li???u!
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
              </ToolkitProvider>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Products;
