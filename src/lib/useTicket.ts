import { TicketId } from "@/types";
import getTicket from "@/utils/getTicket";
import { useQuery } from "@tanstack/react-query";

export const getTicketQueryKey = (ticketId: TicketId) => ["ticket", ticketId];

const useTicket = (ticketId: TicketId) => {
    return useQuery({
        queryKey: getTicketQueryKey(ticketId),
        queryFn: () => getTicket(ticketId),
    });
};

export default useTicket;
