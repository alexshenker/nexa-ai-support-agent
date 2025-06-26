"use client";
import getTickets from "@/utils/getTickets";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

// Types
type TicketStatus = "open" | "closed";
type SortDirection = "asc" | "desc";
type SortField =
    | "id"
    | "user_first"
    | "user_last"
    | "category"
    | "description"
    | "status"
    | "created_at";

interface Ticket {
    id: number;
    user_first: string;
    user_last: string;
    category: string;
    description: string;
    status: TicketStatus;
    created_at: string;
}

interface SortConfig {
    field: SortField | null;
    direction: SortDirection;
}

const Admin = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        direction: "asc",
    });

    // Handle column header click for sorting
    const handleSort = (field: SortField) => {
        setSortConfig((prev) => ({
            field,
            direction:
                prev.field === field && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    useEffect(() => {
        if (tickets.length > 0) {
            return;
        }

        (async () => {
            const t = await getTickets();

            setTickets(t);
        })();
    }, [tickets.length]);

    // Filter and sort tickets
    const processedTickets = useMemo(() => {
        // First, filter based on search
        const filtered = tickets.filter((ticket) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                ticket.id.toString().includes(searchLower) ||
                ticket.user_first.toLowerCase().includes(searchLower) ||
                ticket.user_last.toLowerCase().includes(searchLower) ||
                ticket.category.toLowerCase().includes(searchLower) ||
                ticket.description.toLowerCase().includes(searchLower) ||
                ticket.status.toLowerCase().includes(searchLower)
            );
        });

        // Then sort if a field is selected
        if (sortConfig.field) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.field!];
                const bVal = b[sortConfig.field!];

                if (sortConfig.field === "id") {
                    return sortConfig.direction === "asc"
                        ? Number(aVal) - Number(bVal)
                        : Number(bVal) - Number(aVal);
                }

                if (sortConfig.field === "created_at") {
                    return sortConfig.direction === "asc"
                        ? new Date(aVal as string).getTime() -
                              new Date(bVal as string).getTime()
                        : new Date(bVal as string).getTime() -
                              new Date(aVal as string).getTime();
                }

                const aStr = String(aVal).toLowerCase();
                const bStr = String(bVal).toLowerCase();

                if (sortConfig.direction === "asc") {
                    return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
                } else {
                    return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
                }
            });
        }

        return filtered;
    }, [tickets, searchTerm, sortConfig]);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Box padding={20}>
            {/* Search Box */}
            <Flex mb={6}>
                <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    maxW="400px"
                    borderRadius="md"
                />
            </Flex>

            {/* Table */}
            <Box overflowX="auto" border="1px solid #E2E8F0" borderRadius="lg">
                <Box as="table" width="100%" borderCollapse="collapse">
                    <Box as="thead" bg="#F7FAFC">
                        <Box as="tr">
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("id")}
                                //   _hover={{ bg: "#EDF2F7" }}
                            >
                                ID{" "}
                                {sortConfig.field === "id" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("user_first")}
                                //  _hover={{ bg: "#EDF2F7" }}
                            >
                                First Name{" "}
                                {sortConfig.field === "user_first" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("user_last")}
                                //  _hover={{ bg: "#EDF2F7" }}
                            >
                                Last Name{" "}
                                {sortConfig.field === "user_last" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("category")}
                                //  _hover={{ bg: "#EDF2F7" }}
                            >
                                Category{" "}
                                {sortConfig.field === "category" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("description")}
                                // _hover={{ bg: "#EDF2F7" }}
                            >
                                Description{" "}
                                {sortConfig.field === "description" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("status")}
                                // _hover={{ bg: "#EDF2F7" }}
                            >
                                Status{" "}
                                {sortConfig.field === "status" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                            <Box
                                as="th"
                                p={3}
                                textAlign="left"
                                fontWeight="bold"
                                borderBottom="1px solid #E2E8F0"
                                cursor="pointer"
                                onClick={() => handleSort("created_at")}
                                // _hover={{ bg: "#EDF2F7" }}
                            >
                                Date Created{" "}
                                {sortConfig.field === "created_at" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Box>
                        </Box>
                    </Box>
                    <Box as="tbody">
                        {processedTickets.length === 0 ? (
                            <Box as="tr">
                                <Box
                                    as="td"
                                    columnSpan={"7"}
                                    textAlign="center"
                                    p={8}
                                >
                                    <Text color="gray.500">
                                        {searchTerm
                                            ? "No tickets found matching your search"
                                            : "No tickets available"}
                                    </Text>
                                </Box>
                            </Box>
                        ) : (
                            processedTickets.map((ticket) => (
                                <Box
                                    as="tr"
                                    key={ticket.id}
                                    //  _hover={{ bg: "#F7FAFC" }}
                                    cursor="pointer"
                                >
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                        fontWeight="medium"
                                    >
                                        #{ticket.id}
                                    </Box>
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                    >
                                        {ticket.user_first}
                                    </Box>
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                    >
                                        {ticket.user_last}
                                    </Box>
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                    >
                                        <Box
                                            display="inline-block"
                                            px={2}
                                            py={1}
                                            bg="#E9D8FD"
                                            color="#6B46C1"
                                            fontSize="sm"
                                            borderRadius="md"
                                        >
                                            {ticket.category}
                                        </Box>
                                    </Box>
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                        maxW="250px"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        title={ticket.description}
                                    >
                                        {ticket.description}
                                    </Box>
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                    >
                                        <Box
                                            display="inline-block"
                                            px={2}
                                            py={1}
                                            bg={
                                                ticket.status === "open"
                                                    ? "#C6F6D5"
                                                    : "#E2E8F0"
                                            }
                                            color={
                                                ticket.status === "open"
                                                    ? "#22543D"
                                                    : "#2D3748"
                                            }
                                            fontSize="sm"
                                            borderRadius="md"
                                        >
                                            {ticket.status}
                                        </Box>
                                    </Box>
                                    <Box
                                        as="td"
                                        p={3}
                                        borderBottom="1px solid #E2E8F0"
                                        fontSize="sm"
                                        color="#718096"
                                    >
                                        {formatDate(ticket.created_at)}
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Results count */}
            <Text mt={4} fontSize="sm" color="#718096">
                Showing {processedTickets.length} of {tickets.length} tickets
            </Text>
        </Box>
    );
};

export default Admin;
