"use client";
import NavButtons from "@/components/Nav/Nav";
import { useColorMode } from "@/components/ui/color-mode";
import { Box, IconButton, Stack } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

const Dashboard = (): React.JSX.Element => {
    const { toggleColorMode, colorMode } = useColorMode();

    return (
        <Box
            display={"flex"}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <Stack>
                <IconButton
                    onClick={toggleColorMode}
                    variant="outline"
                    size="sm"
                >
                    {colorMode === "light" ? <LuSun /> : <LuMoon />}
                </IconButton>
                <NavButtons />
            </Stack>
        </Box>
    );
};

export default Dashboard;
