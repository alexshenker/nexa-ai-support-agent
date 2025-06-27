import getTickets from "@/utils/getTickets";
import { useQuery } from "@tanstack/react-query";

export const ticketsQueryKey = ["tickets"];

const useTickets = () => {
    return useQuery({
        queryKey: ticketsQueryKey,
        queryFn: getTickets,
    });
};

export default useTickets;
