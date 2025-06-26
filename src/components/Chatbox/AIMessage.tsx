import { Box, Flex, Text } from "@chakra-ui/react";

interface Props {
    text: string;
}

const AIMessage = (props: Props): React.JSX.Element => {
    return (
        <Flex gap={3}>
            <Box w={8} h={8} borderRadius="full" bg="gray.400" />
            <Box
                bg="gray.300"
                px={4}
                py={2}
                borderRadius="lg"
                borderTopLeftRadius={0}
                maxW="80%"
                color={"gray.600"}
            >
                <Text>{props.text}</Text>
            </Box>
        </Flex>
    );
};

export default AIMessage;
