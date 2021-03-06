import React, { useState, useEffect, useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import { measureSizeActions } from "Redux/Actions";
import filterFactory, {
  customFilter,
  textFilter,
  filterRenderer,
} from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Row, Col, Input, CardHeader } from "reactstrap";
import { useHistory } from "react-router-dom";
import { ViewSVG } from "assets/svg";
import DialogUpdateResult from "./DialogUpdateResult";
import { Edit2SVG } from "assets/svg";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "Redux/Actions";
import _ from "lodash";
import { AddSVG } from "assets/svg";
import DialogDetailMeasure from "./DialogDetailMeasure";
import { notify } from "common";
import ReactNotificationAlert from "react-notification-alert";
import DialogUpdateSewMore from "./DialogUpdateSewMore";

// const { SearchBar } = Search;
function ListResultMeasure({ data, currentOrders }) {
  const { measureSizes } = useSelector((state) => state.measureSizeReducer);
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const notificationAlertRef = useRef(null);
  // const { customers, isDeleteMeasureSize, isGetMeasureSizes } = useSelector(
  //   (state) => state.customerReducer
  // );
  const [measureSizeSearch, setMeasureSizeSearch] = useState("");
  const [formModal, setFormModal] = useState(false);
  const [dataFormModal, setDataFormModal] = useState({});
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [current, setCurrent] = useState({});
  const [dataInOrder, setDataInOrder] = useState({});
  const [isShowDetailMeasure, setIsShowDetailMeasure] = useState(false);
  const [isShowDialogAddSew, setIsShowDialogAddSew] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState({
    page: page,
    limit: rowsPerPage,
    orderId: currentOrders,
    populate:
      "customerOrgId, customerOrgId,productTypeId,productTypeId.productTagIds,sizes.productParameterId,customerSizeId.sizes.productParameterId",
  });

  const { customersInOrder, customerInOrder, isGetCustomersInOrder } =
    useSelector((state) => state.orderReducer);

  const handleGetCustomerInOrder = () => {
    const payload = { ...query };
    if (payload.orderId == "") delete payload["orderId"];
    if (measureSizeSearch === "")
      dispatch(
        orderActions.getCustomersInOrder(queryString.stringify(payload))
      );
    else {
      dispatch(
        orderActions.getCustomersInOrder(
          queryString.stringify({ ...payload, name: measureSizeSearch })
        )
      );
    }
  };
  useEffect(() => {
    console.log(currentOrders);
    if (currentOrders) setQuery({ ...query, orderId: currentOrders });
  }, [currentOrders]);
  useEffect(() => {
    handleGetCustomerInOrder();
  }, [query]);
  const toggleShowDetailMeasure = () => {
    setIsShowDetailMeasure(!isShowDetailMeasure);
  };

  const toggleDialogAddSew = () => {
    setIsShowDialogAddSew(!isShowDialogAddSew);
  };

  const history = useHistory();
  const handleView = (data) => {
    setCurrent(data);
    toggleShowDetailMeasure();
  };

  const handleEdit = (data) => {
    setIsOpenModal(true);
    setDataModal(data);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setDataModal({});
  };
  const boxAction = (cell, row) => {
    return (
      <>
        <button className="btn-none" onClick={() => handleView(row)}>
          <ViewSVG />
        </button>
        <button
          className="btn-none"
          onClick={() => {
            handleEdit(row);
          }}
        >
          <Edit2SVG />
        </button>
        <button
          className="btn-none"
          onClick={() => {
            toggleDialogAddSew();
            setCurrent(row);
          }}
        >
          <AddSVG />
        </button>
      </>
    );
  };
  const columns = [
    {
      dataField: "customerCode",
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
          placeholder="M?? nh??n vi??n"
        />
      ),
    },
    {
      dataField: "customerName",
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
          placeholder="T??n nh??n vi??n"
        />
      ),
    },
    {
      dataField: "age",
      text: "Tu???i",
    },
    {
      dataField: "gender",
      text: "Gi???i t??nh",
    },
    {
      dataField: "customerOrgId.name",
      text: "????n v???/ph??ng ban",
      // hidden: true,
    },
    {
      dataField: "productTypeId.code",
      text: "M?? s???n ph???m ???????c may",
    },
    {
      dataField: "productTypeId.name",
      text: "Lo???i s???n ph???m",
    },
    {
      dataField: "quota",
      text: "SL H??",
    },
    {
      dataField: "",
      text: "Ng??y c???p nh???t",
    },
    {
      dataField: "",
      text: "Ng?????i c???p nh???t",
    },
    {
      dataField: "actions",
      text: "H??nh ?????ng",
      formatter: boxAction,
      formatExtraData: {
        name: "nam",
        age: "20",
      },
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
      console.log("value: ", value);
      setPage(value);
      setQuery({ ...query, page: value });
    },
    sizePerPage: rowsPerPage,
    totalSize: !isNaN(customersInOrder?.totalResults)
      ? customersInOrder?.totalResults
      : 0,
    showTotal: false,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: () => (
      <>
        <Col>
          <p>
            Hi???n th??? t??? {(page - 1) * rowsPerPage + 1} ?????n{" "}
            {page * rowsPerPage > customersInOrder.items.length
              ? !isNaN(customersInOrder?.totalResults)
                ? customersInOrder.totalResults
                : 0
              : page * rowsPerPage}{" "}
            trong s???{" "}
            {!isNaN(customersInOrder?.totalResults)
              ? customersInOrder.totalResults
              : 0}{" "}
            b???n ghi
          </p>
        </Col>
      </>
    ),
  });

  const handleUpdate = (payload, id) => {
    dispatch(
      orderActions.convertMeasureSize(payload, id, {
        success: () => {
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `C???p nh???t chuy???n ?????i th??nh c??ng!`
          );
          handleGetCustomerInOrder();
          handleCloseModal();
        },
        failed: () => {
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `C???p nh???t chuy???n ?????i th???t b???i!`
          );
        },
      })
    );
  };

  const handleAddSewMeasure = (payload, id) => {
    dispatch(
      orderActions.addSewMeasureSize(payload, id, {
        success: () => {
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `?????t may th??m th??nh c??ng!`
          );
          handleGetCustomerInOrder();
          toggleDialogAddSew();
        },
        failed: () => {
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `?????t may th??m th???t b???i!`
          );
        },
      })
    );
  };
  return (
    <>
      <div className="rna-wrapper">
        <ReactNotificationAlert ref={notificationAlertRef} />
      </div>
      <ToolkitProvider
        bootstrap4
        data={customersInOrder.items}
        keyField="id"
        columns={columns}
        search
      >
        {(props) => (
          <>
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
                        onChange={(e) => onSizePerPageChange(e.target.value)}
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
            </Row>
            {isGetCustomersInOrder ? (
              <Row className="align-items-center ">
                <Col md="12" className="d-flex justify-content-center p-5">
                  <div className="spinner-border text-info" />
                </Col>
              </Row>
            ) : (
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
            )}
          </>
        )}
      </ToolkitProvider>

      {isOpenModal && (
        <DialogUpdateResult
          open={isOpenModal}
          data={dataModal}
          toggle={handleCloseModal}
          handleUpdate={handleUpdate}
        />
      )}

      {isShowDetailMeasure && (
        <DialogDetailMeasure
          open={isShowDetailMeasure}
          toggle={toggleShowDetailMeasure}
          data={current}
        />
      )}
      {isShowDialogAddSew && (
        <DialogUpdateSewMore
          open={isShowDialogAddSew}
          toggle={toggleDialogAddSew}
          data={current}
          handleAddSewMeasure={handleAddSewMeasure}
        />
      )}
    </>
  );
}

export default ListResultMeasure;
