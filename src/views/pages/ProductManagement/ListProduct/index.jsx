import React, { useState, useEffect, useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  Card,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import { Style } from "../style";
import SimpleHeader from "./components/Header";
import { ViewSVG } from "assets/svg";
import { EditSVG } from "assets/svg";
import { BinSVG } from "assets/svg";
import DetailProduct from "./components/DetailProduct";
import { productActions } from "Redux/Actions";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { useHistory } from "react-router-dom";
import EditProduct from "../EditProduct";
import ReactNotificationAlert from "react-notification-alert";
import { notify } from "common";
import ModalWarningCustom from "views/pages/components/ModalWarningCustom";

const ListProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { products, isGetProducts, isDeleteProduct } = useSelector(
    (state) => state.productReducer
  );

  const notificationAlertRef = useRef(null);
  const [notificationModal, setNotificationModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [product, setProduct] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dataDialog, setDataDialog] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState({
    page: page,
    limit: rowsPerPage,
    populate: "parentId, productParameterIds",
  });
  const toggleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  const handleView = (data) => {
    toggleOpenDialog();
    setDataDialog(data);
  };
  const handleEdit = (data) => {
    setProduct(data);
    setFormModal(true);
  };
  const handleDelete = (data) => {
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

  const handleUpdateProduct = (data, id, callback) => {
    dispatch(
      productActions.updateProduct(data, id, {
        success: () => {
          callback();
          handleGetProducts();
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `C???p nh???t s???n ph???m th??nh c??ng!`
          );
        },
        failed: (mess) => {
          callback();
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `C???p nh???t s???n ph???m th???t b???i. L???i ${mess}!`
          );
        },
      })
    );
  };

  const boxAction = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        <button
          className="btn-none"
          onClick={() => {
            handleView(row);
          }}
          id="view"
        >
          <ViewSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="view">
          Xem chi ti???t
        </UncontrolledTooltip>
        <button
          className="btn-none"
          onClick={() => {
            handleEdit(row);
          }}
          id="edit"
        >
          <EditSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="edit">
          C???p nh???t s???n ph???m
        </UncontrolledTooltip>
        <button
          onClick={() => {
            // handleDelete(row);
            setProduct(row);
            setNotificationModal(true);
          }}
          className="btn-none"
          id="delete"
        >
          <BinSVG />
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
      text: "M?? s???",
    },
    {
      dataField: "name",
      text: "T??n s???n ph???m",
    },
    {
      dataField: "parentId.name",
      text: "D??ng s???n ph???m",
    },
    {
      dataField: "notes",
      text: "M?? t???",
    },
    {
      dataField: "age",
      text: "H??nh ?????ng",
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

  const handleGetProducts = () => {
    if (productSearch === "") {
      dispatch(productActions.getProducts(queryString.stringify(query)));
    } else {
      dispatch(
        productActions.getProducts(
          queryString.stringify({ ...query, name: productSearch })
        )
      );
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, [query]);

  return (
    <Style>
      {notificationModal && (
        <ModalWarningCustom
          notificationModal={notificationModal}
          setNotificationModal={setNotificationModal}
          name="s???n ph???m"
          func={handleDelete}
          isDelete={isDeleteProduct}
        />
      )}
      <div className="rna-wrapper">
        <ReactNotificationAlert ref={notificationAlertRef} />
      </div>
      {formModal && (
        <EditProduct
          formModal={formModal}
          setFormModal={setFormModal}
          product={product}
          handleUpdateProduct={handleUpdateProduct}
        />
      )}
      <SimpleHeader name="Danh m???c s???n ph???m" />
      <Container fluid className="mt--6">
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
                    {isGetProducts ? (
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
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      handleGetProducts();
                                    }
                                  }}
                                  id="search-by-name"
                                  placeholder="Nh???p t??n"
                                  type="text"
                                  value={productSearch}
                                  onChange={(e) => {
                                    setProductSearch(e.target.value);
                                  }}
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
                  </>
                )}
              </ToolkitProvider>
            </Card>
          </div>
        </Row>
      </Container>
      <DetailProduct
        open={openDialog}
        toggle={toggleOpenDialog}
        data={dataDialog}
      />
    </Style>
  );
};

export default ListProduct;
