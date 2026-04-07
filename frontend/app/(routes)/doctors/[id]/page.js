import { notFound } from "next/navigation";
import {
    getDoctorById,
    getDoctorSchedule,
} from "@/app/_utils/Api";
import DoctorDetailsClient from "./DoctorDetailsClient";

export const dynamic = "force-dynamic";

async function DoctorDetailsPage({ params }) {
    const { id } = await params;

    const [doctor, schedule] = await Promise.all([
        getDoctorById(id),
        getDoctorSchedule(id),
    ]);

    if (!doctor) {
        notFound();
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20 md:py-10">
            <DoctorDetailsClient
                doctor={doctor}
                schedule={schedule}
            />
        </div>
    );
}

export default DoctorDetailsPage;
