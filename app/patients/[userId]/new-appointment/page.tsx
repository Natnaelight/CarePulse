import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";
import { SearchParamProps } from "@/Types";
import { getPatient } from "@/lib/actions/patient.actions";
import * as Sentry from "@sentry/nextjs";

export default async function NewAppointment({ params }: SearchParamProps) {
  // Await params before destructuring to access userId
  const { userId } = await params;

  const patient = await getPatient(userId); // Fetch the patient data using the userId
  Sentry.metrics.set("user_view_newAppointment", patient.name);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        width={1000}
        height={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
