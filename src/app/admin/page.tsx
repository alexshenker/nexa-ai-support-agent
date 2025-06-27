"use client";
import { Ticket } from "@/types";
import getTickets from "@/utils/getTickets";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { orderBy } from "lodash";
import { useEffect, useMemo, useState } from "react";

// Types
type SortDirection = "asc" | "desc";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns = [
    "id",
    "user_first",
    "user_last",
    "category",
    "description",
    "status",
    "created_at",
] as const;

type Column = (typeof columns)[number];

interface SortConfig {
    field: Column;
    direction: SortDirection;
}

/**
 * Normalize for sort & filter
 */
const normalize = (val: string | number): string => {
    if (typeof val === "number") {
        return val.toString();
    }

    return val.toLowerCase().trim();
};

const Admin = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: "id",
        direction: "asc",
    });

    // Handle column header click for sorting
    const handleSort = (field: Column) => {
        setSortConfig((prev) => ({
            field,
            direction:
                prev.field === field && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    useEffect(() => {
        //@TODO: Change to hook
        if (tickets.length > 0) {
            return;
        }

        (async () => {
            const t = await getTickets();

            setTickets(t);
        })();
    }, [tickets.length]);

    const filteredTickets = useMemo(() => {
        const searchNormalized = normalize(searchTerm);

        if (searchNormalized === "") {
            return tickets;
        }

        const filtered = tickets.filter((ticket) => {
            const { id, user_first, user_last, category, description, status } =
                ticket;

            return (
                normalize(id).includes(searchNormalized) ||
                normalize(user_first).includes(searchNormalized) ||
                normalize(user_last).includes(searchNormalized) ||
                normalize(category).includes(searchNormalized) ||
                normalize(description).includes(searchNormalized) ||
                normalize(status).includes(searchNormalized)
            );
        });

        return filtered;
    }, [tickets, searchTerm]);

    const sortedTickets = useMemo(() => {
        if (sortConfig === null) {
            return filteredTickets;
        }

        return orderBy(
            filteredTickets,
            (ticket) => {
                const val = ticket[sortConfig.field!];

                return typeof val === "string" ? normalize(val) : val;
            },
            [sortConfig.direction]
        );
    }, [filteredTickets, sortConfig]);

    const formatDate = (dateString: string) => {
        return format(parseISO(dateString), "MMM d, yyyy h:mm a");
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
                    paddingX={10}
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
                        {sortedTickets.length === 0 ? (
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
                            sortedTickets.map((ticket) => (
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
                Showing {sortedTickets.length} of {tickets.length} tickets
            </Text>
        </Box>
    );
};

export default Admin;
