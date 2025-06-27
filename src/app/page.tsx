"use client";
import NavButtons from "@/components/Nav/Nav";
import { Box } from "@chakra-ui/react";

const Dashboard = (): React.JSX.Element => {
    return (
        <Box
            display={"flex"}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <NavButtons />
        </Box>
    );
};

export default Dashboard;
