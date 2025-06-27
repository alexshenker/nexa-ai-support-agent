"use client";

import NavButtons from "@/components/Nav/Nav";
import { useColorMode } from "@/components/ui/color-mode";
import { Box, ClientOnly, IconButton, Skeleton, Stack } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

const Home = (): React.JSX.Element => {
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
                <ClientOnly fallback={<Skeleton width="100%" height="36px" />}>
                    <IconButton
                        onClick={toggleColorMode}
                        variant="outline"
                        size="sm"
                    >
                        {colorMode === "light" ? <LuSun /> : <LuMoon />}
                    </IconButton>
                </ClientOnly>
                <NavButtons />
            </Stack>
        </Box>
    );
};

export default Home;
