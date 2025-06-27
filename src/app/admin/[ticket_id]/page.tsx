"use client";

import { Drawer } from "@chakra-ui/react";
import { useParams } from "next/navigation";

type Params = {
    ticket_id: string;
};

const Ticket = ({ params }: Params): React.JSX.Element => {
    const { ticket_id } = useParams<Params>();

    return (
        <Drawer.Root>
            <Drawer.Backdrop />
            <Drawer.Trigger />
            <Drawer.Positioner>
                <Drawer.Content>
                    <Drawer.CloseTrigger />
                    <Drawer.Header>
                        <Drawer.Title />
                    </Drawer.Header>
                    <Drawer.Body />
                    <Drawer.Footer />
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    );
};

export default Ticket;
