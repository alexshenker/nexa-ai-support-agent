import { TicketId, TicketStatus } from "@/types";
import updateTicketStatus from "@/utils/updateTicketStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTicketQueryKey } from "./useTicket";
import { ticketsQueryKey } from "./useTickets";

const useUpdateTicketStatus = () => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: async (body: {
            ticketId: TicketId;
            status: TicketStatus;
        }) => {
            return updateTicketStatus(body.ticketId, body.status);
        },
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({
                queryKey: getTicketQueryKey(ticketId),
            });
            queryClient.invalidateQueries({ queryKey: ticketsQueryKey });
        },
    });

    return mutateAsync;
};

export default useUpdateTicketStatus;
