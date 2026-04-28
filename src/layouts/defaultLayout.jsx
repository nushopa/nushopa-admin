import Header from "../components/common/header/";
import { Sidebar } from "../components/common/navigations/sidebar";

export default function DefaultLayout({ children }) {

  return (
      <div className="flex flex-row">
        <Sidebar />
        
        <div className="w-full overflow-hidden">
          <div  className="w-full fixed z-10 top-0">
            <Header />
          </div>
          
          <div className="mt-[4.5rem] pb-4 bg-[#f8f8f8]">{children}</div>
        </div>
      </div>
  );
}
