import { ChatBox } from "@/components/Chatbox/Chatbox";
import NavButtons from "@/components/Nav/Nav";

import { Box, Stack } from "@chakra-ui/react";

const User = (): React.JSX.Element => {
    return (
        <Box
            display="flex"
            height="100vh"
            justifyContent={"center"}
            alignItems="center"
        >
            <Stack padding={4}>
                <NavButtons />
                <ChatBox />
            </Stack>
        </Box>
    );
};

export default User;
