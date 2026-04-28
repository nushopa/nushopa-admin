import { ContactTable } from "../components/molecule/contactTable/contactTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Support() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
        Support Messages
      </div>
      <>
        <ContactTable />
      </>
    </DefaultLayout>
  );
}
