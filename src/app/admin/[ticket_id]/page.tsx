"use client";

import useTicket from "@/lib/useTicket";
import { TicketId } from "@/types";
import { Button, CloseButton, Drawer } from "@chakra-ui/react";
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
        >
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>Drawer Title</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                    </Drawer.Body>
                    <Drawer.Footer>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save</Button>
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
