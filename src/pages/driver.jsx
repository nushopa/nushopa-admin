import { DriverTable } from "../components/molecule/driver/driverTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Driver() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
        Driver&rsquo;s List
      </div>
      <>
        <DriverTable />
      </>
    </DefaultLayout>
  );
}
