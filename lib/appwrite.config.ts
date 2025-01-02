import * as sdk from "node-appwrite";

const {
  NEXT_PUBLIC_ENDPOINT,
  DOCTOR_COLLECTION_ID,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
  BUCKET_ID,
} = process.env;

// Export environment variables
export {
  NEXT_PUBLIC_ENDPOINT,
  DOCTOR_COLLECTION_ID,
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
  BUCKET_ID,
  PROJECT_ID,
};

const client = new sdk.Client();

client
  .setEndpoint(NEXT_PUBLIC_ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
