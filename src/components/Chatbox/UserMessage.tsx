import { Box, Flex, Text } from "@chakra-ui/react";

interface Props {
    text: string;
}

const UserMessage = (props: Props): React.JSX.Element => {
    return (
        <Flex justify="flex-end" gap={3}>
            <Box
                bg="blue.emphasized"
                px={4}
                py={2}
                borderRadius="lg"
                borderTopRightRadius={0}
                maxW="80%"
            >
                <Text>{props.text}</Text>
            </Box>
            <Box w={8} h={8} borderRadius="full" bg="gray.600" flexShrink={0} />
        </Flex>
    );
};

export default UserMessage;
