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
import FormAccount from "./FormAccount";
import FormChangePassword from "./FormChangePassword";
import { EditSVG, DeleteSVG, KeySVG } from "assets/svg";
import Autosuggest from "react-autosuggest";
import { useDispatch, useSelector } from "react-redux";
import { accountActions } from "Redux/Actions";
import queryString from "query-string";
import _ from "lodash";
import { notify } from "common";
import NotificationAlert from "react-notification-alert";

const AccountManage = () => {
  const dispatch = useDispatch();
  const { accounts, isDeleteAccount, isGetAccounts } = useSelector(
    (state) => state.accountReducer
  );

  const notificationAlertRef = useRef(null);
  const [notificationModal, setNotificationModal] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [formModalChangePassword, setFormModalChangePassword] = useState(false);
  const [accountSearch, setAccountSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState({
    page: page,
    limit: rowsPerPage,
    populate: "roleId",
  });
  const [account, setAccount] = useState({});
  const handleGetAccounts = () => {
    if (accountSearch === "") {
      dispatch(accountActions.getAccounts(queryString.stringify(query)));
    } else {
      dispatch(
        accountActions.getAccounts(
          queryString.stringify({ ...query, name: accountSearch })
        )
      );
    }
  };
  useEffect(() => {
    handleGetAccounts();
  }, [query]);

  const handleDelete = () => {
    dispatch(
      accountActions.deleteAccount(account.id, {
        success: () => {
          setNotificationModal(false);
          notify(
            notificationAlertRef,
            "success",
            "Th??ng b??o",
            `X??a t??i kho???n ${account.email} th??nh c??ng!`
          );
          handleGetAccounts();
        },
        failed: () => {
          notify(
            notificationAlertRef,
            "danger",
            "Th??ng b??o",
            `X??a t??i kho???n ${account.email} th???t b???i!`
          );
        },
      })
    );
  };

  const boxAction = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        <button
          style={{
            padding: 0,
            border: "none",
            marginRight: ".5rem",
            background: "none",
          }}
          id="edit"
          onClick={() => {
            setAccount(row);
            setFormModal(true);
            setIsModalAdd(false);
          }}
        >
          <EditSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="edit">
          C???p nh???t th??ng tin t??i kho???n
        </UncontrolledTooltip>
        <button
          style={{
            padding: 0,
            border: "none",
            marginRight: ".5rem",
            background: "none",
          }}
          id="key"
          onClick={() => {
            setAccount(row);
            setFormModalChangePassword(true);
          }}
        >
          <KeySVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="key">
          Thi???t l???p m???t kh???u
        </UncontrolledTooltip>
        <button
          onClick={() => {
            setAccount(row);
            setNotificationModal(true);
          }}
          id="delete"
          style={{ padding: 0, border: "none", background: "none" }}
        >
          <DeleteSVG />
        </button>
        <UncontrolledTooltip delay={1} placement="top" target="delete">
          X??a t??i kho???n
        </UncontrolledTooltip>
      </>
    );
  };
  const columns = [
    {
      dataField: "name",
      text: "T??n t??i kho???n",
    },
    {
      dataField: "roleId.name",
      text: "Nh??m quy???n",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "address",
      text: "?????a ch???",
    },
    {
      dataField: "status",
      text: "Tr???ng th??i",
    },
    {
      dataField: "actions",
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
    totalSize: !isNaN(accounts?.totalResults) ? accounts.totalResults : 0,
    showTotal: false,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: () => (
      <>
        <Col>
          <p>
            Hi???n th??? t??? {(page - 1) * rowsPerPage + 1} ?????n{" "}
            {page * rowsPerPage > accounts.items.length
              ? !isNaN(accounts?.totalResults)
                ? accounts.totalResults
                : 0
              : page * rowsPerPage}{" "}
            trong s???{" "}
            {!isNaN(accounts?.totalResults) ? accounts.totalResults : 0} b???n ghi
          </p>
        </Col>
      </>
    ),
  });

  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      {notificationModal && (
        <ModalWarningCustom
          notificationModal={notificationModal}
          setNotificationModal={setNotificationModal}
          name="t??i kho???n"
          func={handleDelete}
          isDelete={isDeleteAccount}
        />
      )}
      {formModal && (
        <FormAccount
          isModalAdd={isModalAdd}
          formModal={formModal}
          setFormModal={setFormModal}
          notificationAlertRef={notificationAlertRef}
          account={account}
          handleGetAccounts={handleGetAccounts}
        />
      )}
      {formModalChangePassword && (
        <FormChangePassword
          account={account}
          formModalChangePassword={formModalChangePassword}
          setFormModalChangePassword={setFormModalChangePassword}
          notificationAlertRef={notificationAlertRef}
        />
      )}
      <SimpleHeader
        setFormModal={setFormModal}
        setIsModalAdd={setIsModalAdd}
        name="Qu???n l?? t??i kho???n"
        parentName="Qu???n l??"
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card style={{ overflowX: "scroll" }}>
              <ToolkitProvider
                data={accounts.items}
                keyField="id"
                columns={columns}
                search
              >
                {(props) => (
                  <>
                    {isGetAccounts ? (
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
                              <h3 className="mb-0">Danh s??ch t??i kho???n</h3>
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
                                <h4 className="mb-0">T??m ki???m t??n t??i kho???n</h4>
                              </Col>
                              <Col md={6} className="d-flex align-items-center">
                                <Input
                                  id="search-by-name"
                                  placeholder="Nh???p t??n"
                                  type="text"
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      handleGetAccounts();
                                    }
                                  }}
                                  value={accountSearch}
                                  onChange={(e) => {
                                    setAccountSearch(e.target.value);
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
    </>
  );
};

export default AccountManage;
