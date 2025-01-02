"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputFile } from "node-appwrite/file";
import { ID, Query } from "node-appwrite";
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { CreateUserParams, RegisterUserParams } from "@/Types";
import {
  BUCKET_ID,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  NEXT_PUBLIC_ENDPOINT,
} from "@/lib/appwrite.config";

if (
  !BUCKET_ID ||
  !DATABASE_ID ||
  !PATIENT_COLLECTION_ID ||
  !PROJECT_ID ||
  !NEXT_PUBLIC_ENDPOINT
) {
  throw new Error("Missing required environment variables");
}

export const createUser = async (user: CreateUserParams) => {
  console.log(user);
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log(newUser);
    return parseStringify(newUser);
  } catch (error: any) {
    console.log(error);
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", [user.email])]);
      return documents?.users[0];
    }
  }
};
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    let newPatient;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFIle") as Blob,
        identificationDocument?.get("fileName") as string
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);

      newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          ...patient,
          identificationDocumentID: file?.$id || null,
          identificationDocumentURL: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        }
      );
    }
    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
