import { MarketTable } from "../components/molecule/marketTable/marketTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Marketplace() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
        Marketplace List
      </div>
      <>
        <MarketTable />
      </>
    </DefaultLayout>
  );
}
