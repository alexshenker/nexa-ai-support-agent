"use client";

import useTicket from "@/lib/useTicket";
import { TicketId } from "@/types";
import {
    Button,
    CloseButton,
    Drawer,
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type Params = {
    ticket_id: string;
};

const Ticket = (): React.JSX.Element => {
    const { ticket_id } = useParams<Params>();

    const ticket = useTicket(Number(ticket_id) as TicketId);

    const router = useRouter();

    const [open, setOpen] = useState(true);

    return (
        <Drawer.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            onExitComplete={() => router.push("/admin")}
            size="sm"
        >
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>
                            {ticket.isLoading ? (
                                <Skeleton />
                            ) : (
                                `Ticket #${ticket.data?.id ?? " Not Found"}`
                            )}
                        </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        {ticket.isLoading ? (
                            <Skeleton boxSize={"10"} />
                        ) : ticket.data ? (
                            <Stack>
                                <Stack>
                                    {Object.entries(ticket.data).map(
                                        ([key, value]) => {
                                            return (
                                                <Stack
                                                    key={key}
                                                    direction="row"
                                                >
                                                    <Text fontWeight="bold">
                                                        {key}:
                                                    </Text>
                                                    <Text>{value}</Text>
                                                </Stack>
                                            );
                                        }
                                    )}
                                </Stack>

                                {ticket.data.status === "open" ? (
                                    <Button
                                        size="sm"
                                        maxW={"150px"}
                                        colorPalette={"red"}
                                        variant="outline"
                                    >
                                        Close Ticket
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        maxW={"150px"}
                                        variant="outline"
                                        colorPalette={"green"}
                                    >
                                        Reopen Ticket
                                    </Button>
                                )}
                            </Stack>
                        ) : (
                            <Text>Ticket not found</Text>
                        )}
                    </Drawer.Body>
                    <Drawer.Footer>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Drawer.Footer>
                    <Drawer.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Drawer.CloseTrigger>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    );
};

export default Ticket;
