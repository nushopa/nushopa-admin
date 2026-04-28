import { DistributorsTable } from "../components/molecule/distributorsTable/distributorsTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Distributors() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
        Market Rep List
      </div>
      <>
        <DistributorsTable />
      </>
    </DefaultLayout>
  );
}
