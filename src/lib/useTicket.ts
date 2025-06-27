import { TicketId } from "@/types";
import getTicket from "@/utils/getTicket";
import { useQuery } from "@tanstack/react-query";

const useTicket = (ticketId: TicketId) => {
    return useQuery({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicket(ticketId),
    });
};

export default useTicket;
