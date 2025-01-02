"use client";

import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import { Doctors } from "@/constants";

import { Appointment } from "@/Types/appwrite.types";
import { StatusBadge } from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import AppointmentModal from "../AppointmentModal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return (
        <p className="text-14-medium">
          {row.original.patient?.name || "No Name Provided"}
        </p>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );
      return (
        <div className="flex items-center gap-3 ">
          <Image
            src={doctor?.image || "no pic"}
            width={100}
            height={100}
            alt={doctor?.name || "doctor"}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      console.log("Modal Data:", data);
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patient?.$id || "Unknown Patient"}
            userId={data.userId}
            appointment={data}
            // title="Schedule Appointment"
            // description="Please confirm the following details to schedule"
          />
          <AppointmentModal
            type="cancel"
            patientId={data.patient?.$id || "Unknown Patient"}
            userId={data.userId}
            appointment={data}
            // title="Cancel Appointment"
            // description="Are you sure you want to cancel your appointment"
          />
        </div>
      );
    },
  },
];
