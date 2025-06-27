"use client";
import NavButtons from "@/components/Nav/Nav";
import useTickets from "@/lib/useTickets";
import {
    Box,
    Flex,
    Input,
    Skeleton,
    Stack,
    Table,
    Text,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { orderBy, range, startCase, truncate } from "lodash";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useMemo, useState } from "react";

// Types
type SortDirection = "asc" | "desc";

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

const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "M/d/yyyy h:mmaaa");
};

/**
 * Normalize for sort & filter
 */
const normalize = (val: string | number): string => {
    if (typeof val === "number") {
        return val.toString();
    }

    return val.toLowerCase().trim();
};

const Layout = ({ children }: PropsWithChildren) => {
    const tickets = useTickets();

    const router = useRouter();

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

    const filteredTickets = useMemo(() => {
        if (
            tickets.isLoading ||
            tickets.isError ||
            tickets.data === undefined
        ) {
            return [];
        }

        const searchNormalized = normalize(searchTerm);

        if (searchNormalized === "") {
            return tickets.data;
        }

        const filtered = tickets.data.filter((ticket) => {
            const {
                id,
                user_first,
                user_last,
                category,
                description,
                status,
                created_at,
            } = ticket;

            return (
                normalize(id).includes(searchNormalized) ||
                normalize(user_first).includes(searchNormalized) ||
                normalize(user_last).includes(searchNormalized) ||
                normalize(category).includes(searchNormalized) ||
                normalize(description).includes(searchNormalized) ||
                normalize(status).includes(searchNormalized) ||
                normalize(created_at).includes(searchNormalized) ||
                normalize(formatDate(created_at)).includes(searchNormalized)
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

    return (
        <Box padding={20}>
            <Stack>
                <NavButtons />
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
            </Stack>
            <Stack width="full" gap="5">
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            {columns.map((col) => {
                                return (
                                    <Table.ColumnHeader
                                        key={col}
                                        onClick={() => handleSort(col)}
                                        cursor={"pointer"}
                                    >
                                        {startCase(col)}
                                        {sortConfig.field === col && (
                                            <Text ml={2} as="span">
                                                {sortConfig.direction === "asc"
                                                    ? "↑"
                                                    : "↓"}
                                            </Text>
                                        )}
                                    </Table.ColumnHeader>
                                );
                            })}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tickets.isLoading ? (
                            <>
                                {range(7).map((i) => {
                                    return (
                                        <Table.Row key={`skeleton-${i}`}>
                                            <Table.Cell
                                                colSpan={columns.length}
                                            >
                                                <Skeleton
                                                    width="100%"
                                                    height="36px"
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </>
                        ) : (
                            sortedTickets.map((ticket) => {
                                return (
                                    <Table.Row
                                        key={ticket.id}
                                        cursor={"pointer"}
                                        onClick={() =>
                                            router.push(`/admin/${ticket.id}`)
                                        }
                                    >
                                        <Table.Cell>
                                            {"#" + ticket.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ticket.user_first}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ticket.user_last}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ticket.category}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {truncate(ticket.description, {
                                                length: 20,
                                            })}
                                        </Table.Cell>
                                        <Table.Cell>{ticket.status}</Table.Cell>
                                        <Table.Cell>
                                            {formatDate(ticket.created_at)}
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        )}
                    </Table.Body>
                </Table.Root>
            </Stack>
            {/* Results count */}
            <Text mt={4} fontSize="sm" color="gray.500">
                Showing {sortedTickets.length} of{" "}
                {tickets.data?.length ?? "unknown"} tickets
            </Text>
            {children}
        </Box>
    );
};

export default Layout;
