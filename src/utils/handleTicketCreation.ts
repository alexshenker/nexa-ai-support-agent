import { TicketId, UserData } from "@/types";
import { addCategory, createTicket } from "../db/db";
import dedupCategory from "./dedupCategory";

const handleTicketCreation = async (userData: UserData): Promise<TicketId> => {
    const categoryDeduped = await dedupCategory(userData.category ?? "");

    if (categoryDeduped.isNew) {
        addCategory(categoryDeduped.categoryName);
    }

    return createTicket({
        user_first: userData.firstName ?? "",
        user_last: userData.lastName ?? "",
        category: categoryDeduped.categoryName,
        description: userData.issueDescription ?? "",
    });
};

export default handleTicketCreation;
