import React, { useEffect, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import ModalWarningCustom from "views/pages/components/ModalWarningCustom";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader";
import Filter from "../components/Filter";
import { ViewSVG } from "assets/svg";
import { EditSVG } from "assets/svg";
import { BinSVG } from "assets/svg";
import { Style } from "../style";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { orderActions } from "Redux/Actions";
import queryString from "query-string";
import moment from "moment";
import ReactNotificationAlert from "react-notification-alert";
import { notify } from "common";
import DialogFormUpdateOrder from "../components/DialogFormUpdateOrder";
import _ from "lodash";

function ListOrder() {
  const notificationAlertRef = useRef(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const { isGetOrders, orders } = useSelector((state) => state.orderReducer);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [idOrderSelect, setIdOrderSelect] = useState(null);
  const [query, setQuery] = useState({
    page: page,
    limit: rowsPerPage,
    populate: "customerOrganizationId,products.productTypeId",
  });
  const [openFormUpdate, setOpenFormUpdate] = useState(false);
  const [dataFormUpdate, setDataFormUpdate] = useState(null);
  const [textSearch, setTextSearch] = useState("");
  const toggleOpenFormUpdate = () => {
    setOpenFormUpdate(!openFormUpdate);
  };
  const toggleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };
  const handleView = (id) => {
    history.push(`/order-infor/${id}`);
  };
  const handleUpdate = (data) => {
    let { orderStaus, id, history, ...payload } = _.cloneDeep(data);
    payload.products = payload.products.map((item) => {
      return {
        amount: item.amount,
        productTypeId: item.productTypeId.id || item.productTypeId,
      };
    });
    if (!_.isEmpty(payload?.customerOrganizationId)) {
      payload.customerOrganizationId = payload.customerOrganizationId.id;
    }
    payload.orderDetails = payload.orderDetails.map((item) => {
      return {
        customerOrganizationId: item.customerOrganizationId,
        listProduct: item.listProduct.map((product) => {
          return {
            amount: product.amount,
            productTypeId: product.productTypeId,
          };
        }),
      };
    });
    payload.actualDate = payload.actualDate;
    payload.endDate = payload.endDate;
    payload.guaranteeDate = payload.guaranteeDate;
    payload.startDate = payload.startDate;
    dispatch(
      orderActions.updateOrder(payload, data.id, {
        success: () => {
          setNotificationModal(false);
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `C???p nh???t ????n h??ng th??nh c??ng!`
          );
          handleGetOrders();
          toggleOpenFormUpdate();
        },
        failed: () => {
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `C???p nh???t ????n h??ng th???t b???i!`
          );
        },
      })
    );
  };

  const handleDelete = () => {
    dispatch(
      orderActions.deleteOrder(idOrderSelect, {
        success: () => {
          setNotificationModal(false);
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `X??a ????n h??ng th??nh c??ng!`
          );
          handleGetOrders();
        },
        failed: () => {
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `X??a ????n h??ng th???t b???i!`
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
            handleView(cell);
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
            history.push(`/update-order/${row.id}`);
          }}
          id="edit"
        >
          <EditSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="edit">
          S???a ????n h??ng
        </UncontrolledTooltip>
        <button
          onClick={() => {
            setNotificationModal(true);
            setIdOrderSelect(cell);
          }}
          className="btn-none"
          id="delete"
        >
          <BinSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="delete">
          X??a ????n h??ng
        </UncontrolledTooltip>
      </>
    );
  };

  const columns = [
    {
      dataField: "code",
      text: "",
      filter: textFilter(),
      filterRenderer: (onFilter, column) => (
        <Input
          key="input"
          type="search"
          className="border-bottom-search"
          onChange={(e) => {
            onFilter(e.target.value);
          }}
          placeholder="M?? ????n h??ng"
        />
      ),
    },
    {
      dataField: "name",
      text: "",
      filter: textFilter(),
      filterRenderer: (onFilter, column) => (
        <Input
          key="input"
          type="search"
          className="border-bottom-search"
          onChange={(e) => {
            onFilter(e.target.value);
          }}
          placeholder="T??n ????n h??ng"
        />
      ),
    },
    {
      dataField: "customerOrganizationId.name",
      text: "",
      filter: textFilter(),
      filterRenderer: (onFilter, column) => (
        <Input
          key="input"
          type="search"
          className="border-bottom-search"
          onChange={(e) => {
            onFilter(e.target.value);
          }}
          placeholder="????n v??? th???c hi???n"
        />
      ),
    },
    {
      dataField: "startDate",
      text: "Th???i gian b???t ?????u",
      formatter: (cell) => {
        return moment(new Date(cell)).format("DD/MM/YYYY");
      },
    },
    {
      dataField: "id",
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
    totalSize: !isNaN(orders?.totalResults) ? orders.totalResults : 0,
    showTotal: false,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: () => (
      <>
        <Col>
          <p>
            Hi???n th??? t??? {(page - 1) * rowsPerPage + 1} ?????n{" "}
            {page * rowsPerPage > orders.items.length
              ? !isNaN(orders?.totalResults)
                ? orders.totalResults
                : 0
              : page * rowsPerPage}{" "}
            trong s??? {!isNaN(orders?.totalResults) ? orders.totalResults : 0}{" "}
            b???n ghi
          </p>
        </Col>
      </>
    ),
  });
  const handleGetOrdersWithName = () => {
    if (textSearch) {
      dispatch(
        orderActions.getOrders(
          queryString.stringify({ ...query, name: textSearch })
        )
      );
    } else {
      handleGetOrders();
    }
  };
  const handleGetOrders = () => {
    dispatch(
      orderActions.getOrders(queryString.stringify({ ...query, page: 1 }))
    );
  };

  useEffect(() => {
    handleGetOrders();
  }, [query]);

  const handleFilter = (data) => {
    dispatch(
      orderActions.getOrders(
        queryString.stringify({ ...query, page: 1, ...data })
      )
    );
  };
  return (
    <Style>
      <div className="rna-wrapper">
        <ReactNotificationAlert ref={notificationAlertRef} />
      </div>
      {notificationModal && (
        <ModalWarningCustom
          notificationModal={notificationModal}
          setNotificationModal={setNotificationModal}
          name="kh??ch h??ng"
          func={handleDelete}
        />
      )}
      <SimpleHeader
        name="Qu???n l?? ????n h??ng"
        parentName="Qu???n l??"
        handleAdd={() => {
          history.push("/add-order");
        }}
        handleFilter={toggleOpenFilter}
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card style={{ overflowX: "scroll" }}>
              <ToolkitProvider
                bootstrap4
                data={orders.items}
                keyField="id"
                columns={columns}
                search
              >
                {(props) => (
                  <>
                    <Row>
                      <Col>
                        <CardHeader>
                          <h3 className="mb-0">Danh s??ch ????n h??ng</h3>
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
                            <h4 className="mb-0">T??m ki???m t??n ????n h??ng</h4>
                          </Col>
                          <Col md={6} className="d-flex align-items-center">
                            <Input
                              id="search-by-name"
                              placeholder="Nh???p t??n"
                              type="text"
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  handleGetOrdersWithName();
                                }
                              }}
                              name="textSearch"
                              onChange={(e) => {
                                setTextSearch(e.target.value);
                              }}
                              value={textSearch}
                              className="py-0"
                              bsSize="sm"
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {isGetOrders ? (
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
                        <BootstrapTable
                          {...props.baseProps}
                          noDataIndication={() => {
                            return (
                              <span className="font-weight-bold text-danger">
                                Kh??ng c?? d??? li???u!
                              </span>
                            );
                          }}
                          filter={filterFactory()}
                          pagination={pagination}
                          bordered={false}
                          hover
                          striped
                          condensed
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
      {openFilter && (
        <Filter handleClose={toggleOpenFilter} handleFilter={handleFilter} />
      )}
      <DialogFormUpdateOrder
        open={openFormUpdate}
        toggle={toggleOpenFormUpdate}
        dataFormModal={dataFormUpdate}
        handleUpdate={handleUpdate}
      />
    </Style>
  );
}

export default ListOrder;
