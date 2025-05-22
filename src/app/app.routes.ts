import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { CustomerProfileComponent } from './component/customer-profile/customer-profile.component';
import { CustomerLoginComponent } from './component/customer-login/customer-login.component';
import { VendorProfileComponent } from './component/vendor-profile/vendor-profile.component';
import { VendorLoginComponent } from './component/vendor-login/vendor-login.component';
import { EmployeeLoginComponent } from './component/employee-login/employee-login.component';
import { EmployeeProfileComponent } from './component/employee-profile/employee-profile.component';
import { EmployeeLeaveComponent } from './component/employee-leave/employee-leave.component';
import { EmployeePayslipComponent } from './component/employee-payslip/employee-payslip.component';
import { InvoiceDetailsComponent } from './component/customer/invoice-details/invoice-details.component';
import { PaymentsAndAgingComponent } from './component/customer/payments-and-aging/payments-and-aging.component';
import { SalesOrderDataComponent } from './component/customer/sales-order-data/sales-order-data.component';
import { OverallSalesSummaryComponent } from './component/customer/overall-sales-summary/overall-sales-summary.component';
import { InquiryDataComponent } from './component/customer/inquiry-data/inquiry-data.component';
import { CreditDebitMemosComponent } from './component/customer/credit-debit-memos/credit-debit-memos.component';
import { ListOfDeliveryComponent } from './component/customer/list-of-delivery/list-of-delivery.component';
import { GoodsReceiptComponent } from './component/vendor/goods-receipt/goods-receipt.component';
import { PurchaseOrderComponent } from './component/vendor/purchase-order/purchase-order.component';
import { RequestForQuotationComponent } from './component/vendor/request-for-quotation/request-for-quotation.component';
import { CreditAndDebitMemosComponent } from './component/vendor/credit-and-debit-memos/credit-and-debit-memos.component';
import { PaymentsAndAgingComponent as Payment } from './component/vendor/payments-and-aging/payments-and-aging.component';
import { InvoiceDetailsComponent as Invoice } from './component/vendor/invoice-details/invoice-details.component';
import { authGuard } from './utils/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent,
  },
  {
    path: 'customer/login',
    component: CustomerLoginComponent
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'profile',
        component: CustomerProfileComponent,
      },
      {
        path: 'invoice-details',
        component: InvoiceDetailsComponent,
      },
      {
        path: 'payments-and-aging',
        component: PaymentsAndAgingComponent,
      },
      {
        path: 'sales-order-data',
        component: SalesOrderDataComponent,
      },
      {
        path: 'overall-sales-summary',
        component: OverallSalesSummaryComponent,
      },
      {
        path: 'inquiry-data',
        component: InquiryDataComponent,
      },
      {
        path: 'credit-debit-memos',
        component: CreditDebitMemosComponent,
      },
      {
        path: 'list-of-delivery',
        component: ListOfDeliveryComponent,
      }
    ]
  },
  {
    path: 'vendor/login',
    component: VendorLoginComponent
  },
  {
    path: 'vendor',
    component: VendorComponent,
    children: [
      {
        path: 'profile',
        component: VendorProfileComponent
      },
      {
        path: 'goods-receipt',
        component: GoodsReceiptComponent
      },
      {
        path: 'purchase-order',
        component: PurchaseOrderComponent
      },
      {
        path: 'request-for-quotation',
        component: RequestForQuotationComponent
      },
      {
        path: 'invoice-details',
        component: Invoice
      },
      {
        path: 'payments-and-aging',
        component: Payment
      },
      {
        path: 'credit-debit-memos',
        component: CreditAndDebitMemosComponent
      }
    ]

  },
  {
    path: 'employee/login',
    component: EmployeeLoginComponent
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    children: [
      {
        path: 'profile',
        component: EmployeeProfileComponent
      },
      {
        path: 'leave-data',
        component: EmployeeLeaveComponent
      },
      {
        path: 'pay-slip',
        component: EmployeePayslipComponent
      }
    ]
  }
];
