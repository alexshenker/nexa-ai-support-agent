import { Box, Flex, Text } from "@chakra-ui/react";
import SuppyAvatar from "./SuppyAvatar";

interface Props {
    text: string;
}

const AIMessage = (props: Props): React.JSX.Element => {
    return (
        <Flex gap={3}>
            <SuppyAvatar />
            <Box
                px={4}
                py={2}
                borderRadius="lg"
                borderTopLeftRadius={0}
                maxW="80%"
                bg={"gray.muted"}
            >
                <Text>{props.text}</Text>
            </Box>
        </Flex>
    );
};

export default AIMessage;
