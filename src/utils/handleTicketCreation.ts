import { UserData } from "@/types";
import { addCategory, createTicket } from "../db/db";
import dedupCategory from "./dedupCategory";

const handleTicketCreation = async (userData: UserData): Promise<void> => {
    const categoryDeduped = await dedupCategory(userData.category ?? "");

    if (categoryDeduped.isNew) {
        addCategory(categoryDeduped.categoryName);
    }

    createTicket({
        user_first: userData.firstName ?? "",
        user_last: userData.lastName ?? "",
        category: categoryDeduped.categoryName,
        description: userData.issueDescription ?? "",
    });
};

export default handleTicketCreation;
