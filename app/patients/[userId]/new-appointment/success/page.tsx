import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getAppointment } from "@/lib/actions/appointments.actions";
import { Doctors } from "@/constants";
import { SearchParamProps } from "@/Types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  // Await searchParams to ensure it is resolved
  const resolvedSearchParams = await searchParams;

  // Safely access appointmentId, assuming it can be an array
  const appointmentId = Array.isArray(resolvedSearchParams?.appointmentId)
    ? resolvedSearchParams?.appointmentId[0] // Take the first value if it's an array
    : resolvedSearchParams?.appointmentId || ""; // Default to empty string if undefined

  // Fetch the appointment details
  const appointment = await getAppointment(appointmentId);

  // Find the corresponding doctor
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_appointment-success", user.name);
  return (
    <div className="flex h-screen max-h-screen px-[5%] ">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="Logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            alt="success"
            height={300}
            width={280}
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            successfuly been submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image || "/placeholder-doctor.png"}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                alt="calendar"
                height={24}
                width={24}
              />
              <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </div>
        </section>
        <Button className="shad-primary-btn" asChild>
          <div>
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </div>
        </Button>
        <p className="copyright">© 2024 CarePulse</p>
      </div>
    </div>
  );
};

export default Success;
