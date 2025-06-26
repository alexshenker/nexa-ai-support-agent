"use client";
import { AIResponseID, UserRequest } from "@/types";
import { MAX_AI_RESPONSES, MAX_CHARACTERS } from "@/utils/constants";
import sendUserMessage from "@/utils/sendUserMessage";
import { Box, Button, Flex, Input, Skeleton, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { v4 } from "uuid";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";

type Message =
    | {
          id: string;
          text: string;
          sender: "system" | "user";
      }
    | {
          id: AIResponseID;
          text: string;
          sender: "ai";
      };

const responseFailureMessage: Message = {
    id: v4(),
    text: "Sorry, I was unable to process your request.",
    sender: "system",
};

const initialMessages: Message[] = [
    {
        id: v4(),
        text: "Hello! I am your assistant. How may I help you today?",
        sender: "system",
    },
];

export function ChatBox() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const totalAIResponses = useMemo(() => {
        return messages.filter((msg) => msg.sender === "ai").length;
    }, [messages]);

    const [inputValue, setInputValue] = useState("");

    const [responseLoading, setResponseLoading] = useState(false);

    const [lastAIResponseID, setLastAIResponseID] =
        useState<AIResponseID | null>(null);

    const handleUserMessage = async () => {
        setResponseLoading(true);

        const body: UserRequest = {
            message: inputValue,
            previous_response_id: lastAIResponseID,
        };

        setInputValue("");

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                id: v4(),
                text: inputValue,
                sender: "user",
            },
        ]);

        const res = await sendUserMessage(body);

        setResponseLoading(false);

        if (res.success === false) {
            setMessages((prevMessages) => [
                ...prevMessages,
                responseFailureMessage,
            ]);

            return;
        }

        setLastAIResponseID(res.data.previous_response_id);

        setMessages((prevMessages) => [
            ...prevMessages,

            {
                id: res.data.previous_response_id,
                text: res.data.responseToUser,
                sender: "ai",
            },
        ]);
    };

    const submitEnabled =
        inputValue.trim() !== "" && inputValue.length <= MAX_CHARACTERS;

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!submitEnabled) {
            return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default form submission
            handleUserMessage();
        }
    };

    return (
        <Flex
            direction="column"
            h="600px"
            maxW="500px"
            mx="auto"
            border="1px solid #3f3f3f"
            borderRadius="lg"
            overflow="hidden"
            bgColor={"gray.100"}
        >
            {/* Chat Header */}
            <Flex
                px={4}
                py={3}
                borderBottom="1px solid #3f3f3f"
                bg="white"
                align="center"
                gap={3}
                bgColor={"gray.100"}
            >
                <Box w={8} h={8} borderRadius="full" bg="blue.500" />
                <Box>
                    <Text fontWeight="bold" color={"gray.600"}>
                        Support Assistant
                    </Text>
                    <Text fontSize="xs" color="green.600">
                        ● Online
                    </Text>
                </Box>
            </Flex>

            {/* Messages Area */}
            <Flex flex={1} direction="column" overflowY="auto" p={4} gap={4}>
                {messages.map((message) => {
                    switch (message.sender) {
                        case "user":
                            return (
                                <UserMessage
                                    key={message.id}
                                    text={message.text}
                                />
                            );
                        case "ai":
                            return (
                                <AIMessage
                                    key={message.id}
                                    text={message.text}
                                />
                            );
                        case "system":
                            return (
                                <AIMessage
                                    key={message.id}
                                    text={message.text}
                                />
                            );
                        default:
                            return null;
                    }
                })}
                {responseLoading && (
                    <Flex gap={3}>
                        <Box w={8} h={8} borderRadius="full" bg="gray.400" />
                        <Skeleton
                            height="40px"
                            width="200px"
                            borderRadius="lg"
                        />
                    </Flex>
                )}
            </Flex>

            {/* Input Area */}
            <Flex
                p={4}
                borderTop="1px solid #3f3f3f"
                bg="white"
                gap={2}
                bgColor={"gray.100"}
            >
                <Box width={"100%"}>
                    <Input
                        placeholder="Type your message..."
                        borderRadius="full"
                        paddingX={10}
                        onKeyDown={handleEnter}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        color="gray.600"
                        disabled={totalAIResponses >= MAX_AI_RESPONSES}
                    />
                    {inputValue.length > MAX_CHARACTERS && (
                        <Text color="red.500" fontSize="xs">
                            Message is too long
                        </Text>
                    )}
                    {totalAIResponses >= MAX_AI_RESPONSES && (
                        <Text color="red.500" fontSize="xs">
                            Sorry - you&#39;ve reached the chat limit.
                        </Text>
                    )}
                </Box>

                <Button
                    onClick={handleUserMessage}
                    borderRadius="full"
                    disabled={!submitEnabled}
                >
                    Send
                </Button>
            </Flex>
        </Flex>
    );
}
