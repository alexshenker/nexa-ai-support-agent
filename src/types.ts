import { z } from "zod";

export type PreviousResponseID = string & { __brand: "Previous_Response_ID" };
export const PreviousResponseID = z.custom<PreviousResponseID>();
