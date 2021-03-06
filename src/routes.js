import LoginPage from "views/pages/LoginPage";
import ForgotPasswordPage from "views/pages/ForgotPasswordPage";
import ResetPasswordPage from "views/pages/ResetPasswordPage";
import Dashboard from "views/pages/dashboards/Dashboard.js";
import AccountManage from "views/pages/AccountManage";
import RoleManage from "views/pages/RoleManage";
import ProducerManage from "views/pages/ProducerManage";
import ProductGroups from "views/pages/CategorySettings/ProductGroups";
import ProductTypes from "views/pages/CategorySettings/ProductTypes";
import ProductUnits from "views/pages/CategorySettings/ProductUnits";
import DetailedDefinition from "views/pages/CategroryDefinition/DetailedDefinition";
import ProductDefinition from "views/pages/CategroryDefinition/ProductDefinition";
import PackageDefinition from "views/pages/CategroryDefinition/PackageDefinition";
import BlockDefinition from "views/pages/CategroryDefinition/BlockDefinition";
import CommandProductionInOut from "views/pages/ProductionInfoManagement/CommandProductionInOut";
import CommandProductionInOutOrder from "views/pages/ProductionInfoManagement/CommandProductionInOutOrder";
import CompanyDefinition from "views/pages/ProductionInfoManagement/CompanyDefinition";
import CustomerDefinition from "views/pages/ProductionInfoManagement/CustomerDefinition";
import FactoryDefinition from "views/pages/ProductionInfoManagement/FactoryDefinition";
import InventoryDefinition from "views/pages/ProductionInfoManagement/InventoryDefinition";
import ProducerDefinition from "views/pages/ProductionInfoManagement/ProducerDefinition";
import PurchaseOrderDefinition from "views/pages/ProductionInfoManagement/PurchaseOrderDefinition";
import SalesDefinition from "views/pages/ProductionInfoManagement/SalesDefinition";
import SettingWarehouse from "views/pages/ProductionInfoManagement/SettingWarehouse";
import WarehouseDefinition from "views/pages/ProductionInfoManagement/WarehouseDefinition";
import ImportWarehouse from "views/pages/ImportWarehouse";
import ExportWarehouse from "views/pages/ExportWarehouse";
import ExpiryWarning from "views/pages/WarehouseManage/ExpiryWarning";
import Inventories from "views/pages/WarehouseManage/Inventories";
import InventoryReport from "views/pages/WarehouseManage/InventoryReport";
import StatisticsInventory from "views/pages/WarehouseManage/StatisticsInventory";
import StorageWarning from "views/pages/WarehouseManage/StorageWarning";
import {
  DashboardSVG,
  SettingSVG,
  CategorySVG,
  ProductionSVG,
  ExportSVG,
  ImportSVG,
  TransferSVG,
  InventorySVG,
  CheckSpaceSVG,
} from "assets/svg";

const routes = [
  {
    name: "T???ng quan",
    state: "dashboard",
    big: true,
    svg: DashboardSVG,
    path: "dashboard",
    component: Dashboard,
    layout: "/",
  },
  {
    collapse: true,
    name: "C??i ?????t danh m???c",
    state: "category-setting",
    svg: SettingSVG,
    views: [
      {
        path: "product-groups",
        name: "Nh??m s???n ph???m",
        miniName: "PG",
        component: ProductGroups,
        layout: "/",
      },
      {
        path: "product-types",
        name: "Ki???u s???n ph???m",
        miniName: "PT",
        component: ProductTypes,
        layout: "/",
      },
      {
        path: "product-units",
        name: "????n v??? s???n ph???m",
        miniName: "PU",
        component: ProductUnits,
        layout: "/",
      },
    ],
  },
  {
    collapse: true,
    name: "?????nh ngh??a danh m???c",
    state: "category-definition",
    svg: CategorySVG,
    views: [
      {
        path: "detailed-definition",
        name: "?????nh ngh??a chi ti???t",
        miniName: "DD",
        component: DetailedDefinition,
        layout: "/",
      },
      {
        path: "product-definition",
        name: "?????nh ngh??a s???n ph???m",
        miniName: "PD",
        component: ProductDefinition,
        layout: "/",
      },
      {
        path: "package-definition",
        name: "?????nh ngh??a ????ng g??i",
        miniName: "PD",
        component: PackageDefinition,
        layout: "/",
      },
      {
        path: "block-definition",
        name: "?????nh ngh??a ki???n",
        miniName: "BD",
        component: BlockDefinition,
        layout: "/",
      },
    ],
  },
  {
    collapse: true,
    state: "production-info-management",
    name: "Qu???n l?? th??ng tin SX",
    svg: ProductionSVG,
    views: [
      {
        path: "company-definition",
        name: "?????nh ngh??a c??ng ty",
        miniName: "CD",
        component: CommandProductionInOut,
        layout: "/",
      },
      {
        path: "factory-definition",
        name: "?????nh ngh??a nh?? m??y",
        miniName: "FD",
        component: CommandProductionInOutOrder,
        layout: "/",
      },
      {
        path: "producer-definition",
        name: "?????nh ngh??a nh?? cung c???p",
        miniName: "PD",
        component: CompanyDefinition,
        layout: "/",
      },
      {
        path: "customer-definition",
        name: "?????nh ngh??a kh??ch h??ng",
        miniName: "CD",
        component: CustomerDefinition,
        layout: "/",
      },
      {
        path: "purchase-order-definition",
        name: "?????nh ngh??a ????n ?????t h??ng",
        miniName: "POD",
        component: PurchaseOrderDefinition,
        layout: "/",
      },
      {
        path: "sales-definition",
        name: "?????nh ngh??a ????n b??n h??ng",
        miniName: "SD",
        component: SalesDefinition,
        layout: "/",
      },
      {
        path: "command-production-inout",
        name: "L???nh xu???t nh???p",
        miniName: "CPIO",
        component: CommandProductionInOut,
        layout: "/",
      },
      {
        path: "command-production-inout-follow-order",
        name: "L???nh xu???t theo ????n b??n h??ng",
        miniName: "CDIOFO",
        component: CommandProductionInOutOrder,
        layout: "/",
      },
      {
        path: "inventory-definition",
        name: "?????nh ngh??a l???nh ki???m k??",
        miniName: "ID",
        component: InventoryDefinition,
        layout: "/",
      },
      {
        path: "setting-warehouse",
        name: "C??i ?????t kho",
        miniName: "SD",
        component: SettingWarehouse,
        layout: "/",
      },
      {
        path: "warehouse-definition",
        name: "?????nh ngh??a kho",
        miniName: "WD",
        component: WarehouseDefinition,
        layout: "/",
      },
    ],
  },
  {
    collapse: false,
    big: true,
    path: "import-warehouse",
    name: "Nh???p kho",
    svg: ImportSVG,
    component: ImportWarehouse,
    layout: "/",
  },
  {
    collapse: false,
    big: true,
    path: "export-warehouse",
    name: "Xu???t kho",
    svg: ExportSVG,
    component: ExportWarehouse,
    layout: "/",
  },
  {
    collapse: true,
    state: "inventory-manage",
    name: "Qu???n l?? t???n kho",
    svg: InventorySVG,
    views: [
      {
        path: "inventory-report",
        name: "B??o c??o t???n kho",
        miniName: "SD",
        component: InventoryReport,
        layout: "/",
      },
      {
        path: "storage-warning",
        name: "C???nh b??o qu?? h???n l??u kho",
        miniName: "AD",
        component: StorageWarning,
        layout: "/",
      },
      {
        path: "inventories",
        name: "Th???ng k?? v??? ki???m k??",
        miniName: "FD",
        component: Inventories,
        layout: "/",
      },
      {
        path: "statistics-inventory",
        name: "Th???ng k?? v??? t???n kho",
        miniName: "FD",
        component: StatisticsInventory,
        layout: "/",
      },
      {
        path: "expiry-warning",
        name: "C???nh b??o qu?? h???n s??? d???ng",
        miniName: "FD",
        component: ExpiryWarning,
        layout: "/",
      },
    ],
  },
  {
    path: "check-warehouse-space",
    big: true,
    state: "check-warehouse-space",
    collapse: false,
    name: "Ki???m tra kho???ng tr???ng kho",
    svg: CheckSpaceSVG,
    component: ProducerManage,
    layout: "/",
  },
  {
    collapse: true,
    redirect: true,
    name: "Auth",
    icon: "ni ni-ungroup text-orange",
    state: "examplesAuth",
    role: "",
    views: [
      {
        path: "/login",
        name: "LoginPage",
        miniName: "L",
        component: LoginPage,
        layout: "/auth",
      },
      {
        path: "/forgot-password",
        name: "ForgotPasswordPage",
        miniName: "F",
        component: ForgotPasswordPage,
        layout: "/auth",
      },
      {
        path: "/reset-password",
        name: "ResetPasswordPage",
        miniName: "R",
        component: ResetPasswordPage,
        layout: "/auth",
      },
    ],
  },
];
export default routes;
export const routeAdmin = [
  {
    collapse: true,
    name: "T??i kho???n ng?????i d??ng",
    icon: "ni ni-circle-08",
    state: "accountCollapse",
    views: [
      {
        path: "accounts",
        name: "Qu???n l?? t??i kho???n",
        miniName: "A",
        component: AccountManage,
        layout: "/",
      },
      {
        path: "roles",
        name: "Qu???n l?? ph??n quy???n",
        miniName: "R",
        component: RoleManage,
        layout: "/",
      },
    ],
  },
  // {
  //   collapse: true,
  //   name: "Kh??ch h??ng",
  //   icon: "ni ni-badge",
  //   state: "userCollapse",
  //   views: [
  //     {
  //       path: "customers",
  //       name: "Danh s??ch",
  //       miniName: "Q",
  //       component: CustomerManage,
  //       layout: "/",
  //     },
  //     // {
  //     //   path: "add-customer",
  //     //   name: "Th??m m???i",
  //     //   miniName: "T",
  //     //   component: AddCustomer,
  //     //   layout: "/",
  //     // },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Nh?? s???n xu???t",
  //   icon: "ni ni-building",
  //   state: "producerCollapse",
  //   views: [
  //     {
  //       path: "producers",
  //       name: "Danh s??ch",
  //       miniName: "PM",
  //       component: ProducerManage,
  //       layout: "/",
  //     },
  //     // {
  //     // 	path: "add-producer",
  //     // 	name: "Th??m m???i",
  //     // 	miniName: "AP",
  //     // 	component: AddProducer,
  //     // 	layout: "/",
  //     // },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Kho h??ng NPL",
  //   icon: "ni ni-box-2",
  //   state: "warehouseCollapse",
  //   views: [
  //     {
  //       path: "npl-types",
  //       name: "Th??? lo???i",
  //       miniName: "NPLT",
  //       component: NplTypes,
  //       layout: "/",
  //     },
  //     {
  //       path: "npls",
  //       name: "Danh s??ch",
  //       miniName: "Q",
  //       component: NplManage,
  //       layout: "/",
  //     },
  //     {
  //       path: "add-npl",
  //       name: "Th??m m???i",
  //       miniName: "T",
  //       component: AddNPL,
  //       layout: "/",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Ti??u chu???n s??? ??o",
  //   icon: "ni ni-ruler-pencil",
  //   state: "standardCollapse",
  //   views: [
  //     {
  //       path: "list-standards",
  //       name: "Danh s??ch",
  //       miniName: "MS",
  //       component: ListMeasurementStandards,
  //       layout: "/",
  //     },
  //     {
  //       path: "add-standards",
  //       name: "T???o m???i",
  //       miniName: "Q",
  //       component: AddMeasurementStandard,
  //       layout: "/",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Danh m???c s???n ph???m",
  //   icon: "ni ni-cart",
  //   state: "productCollapse",
  //   views: [
  //     {
  //       path: "type-product",
  //       name: "D??ng s???n ph???m",
  //       miniName: "TP",
  //       component: TypeProduct,
  //       layout: "/",
  //     },
  //     {
  //       path: "list-product",
  //       name: "Danh s??ch s???n ph???m",
  //       miniName: "TP",
  //       component: ListProduct,
  //       layout: "/",
  //     },
  //     {
  //       path: "add-product",
  //       name: "T???o m???i",
  //       miniName: "AD",
  //       component: AddProduct,
  //       layout: "/",
  //     },
  //   ],
  // },
];
