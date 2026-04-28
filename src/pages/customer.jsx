import { CustomerTable } from "../components/molecule/customerTable/customerTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Customer() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
      Customers Account List
      </div>
      <>
        <CustomerTable />
      </>
    </DefaultLayout>
  );
}
