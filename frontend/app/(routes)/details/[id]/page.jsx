import { getDoctorById } from "@/app/_utils/Api";
import DoctorSuggestions from "../_components/DoctorSuggestions";
import DoctorDetails from "../_components/DoctorDetails";
import { notFound } from "next/navigation";

async function Details({ params }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);

  if (!doctor) {
    notFound();
  }

  const categoryName = doctor?.category?.name;
  const currentDoctorId = doctor?.documentId;
  return (
    <div className="page-shell md:px-20">
      <div className="grid md:grid-cols-4 grid-cols-1">
        {/* doctor details*/}
        <div className=" col-span-3 ">
          <DoctorDetails doctor={doctor} />
        </div>

        {/* doctor suggestions*/}
        <div>
          <DoctorSuggestions
            categoryName={categoryName}
            currentDoctorId={currentDoctorId}
          />
        </div>
      </div>
    </div>
  );
}

export default Details;
