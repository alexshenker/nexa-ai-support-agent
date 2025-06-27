"use client";
import { AIResponseID, TicketId, UserRequest } from "@/types";
import { MAX_AI_RESPONSES, MAX_CHARACTERS } from "@/utils/constants";
import sendUserMessage from "@/utils/sendUserMessage";
import {
    Box,
    Button,
    Card,
    Field,
    Flex,
    Input,
    Skeleton,
    Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 } from "uuid";
import AIMessage from "./AIMessage";
import SuppyAvatar from "./SuppyAvatar";
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
        text: "Hello! I am Suppy! And I am your assistant. How may I help you today?",
        sender: "system",
    },
];

export function ChatBox() {
    /* Used to scroll to the bottom of the chat box */
    const chatBoxBottomRef = useRef<HTMLDivElement>(null);

    const [ticketID, setTicketID] = useState<TicketId | null>(null);

    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const totalAIResponses = useMemo(() => {
        return messages.filter((msg) => msg.sender === "ai").length;
    }, [messages]);

    const [inputValue, setInputValue] = useState("");

    const [responseLoading, setResponseLoading] = useState(false);

    const [lastAIResponseID, setLastAIResponseID] =
        useState<AIResponseID | null>(null);

    const scrollToBottom = () => {
        chatBoxBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        if (res.data.ticketId !== null) {
            setTicketID(res.data.ticketId);
        }

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
        inputValue.trim() !== "" &&
        inputValue.length <= MAX_CHARACTERS &&
        ticketID === null &&
        totalAIResponses < MAX_AI_RESPONSES;

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
        <Card.Root
            direction="column"
            h="400px"
            maxW="500px"
            mx="auto"
            borderRadius="lg"
            overflow="hidden"
        >
            {/* Chat Header */}
            <Card.Header px={4} py={3} gap={3}>
                <Flex gap={3}>
                    <SuppyAvatar />
                    <Box>
                        <Text fontWeight="bold" color={"gray.600"}>
                            Suppy the Support Assistant
                        </Text>
                        <Text fontSize="xs" color="green.600">
                            ● Online
                        </Text>
                    </Box>
                </Flex>
            </Card.Header>

            {/* Messages Area */}
            <Card.Body
                flex={1}
                direction="column"
                overflowY="auto"
                p={4}
                gap={4}
                borderTop="1px solid"
                borderColor="border.emphasized"
            >
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
                {ticketID !== null && (
                    <AIMessage
                        key={v4()}
                        text={`Your ticket ID is: ${ticketID}`}
                    />
                )}
                <div ref={chatBoxBottomRef} />
            </Card.Body>

            {/* Input Area */}
            <Card.Footer
                p={4}
                gap={2}
                borderTop="1px solid"
                borderColor="border.emphasized"
            >
                <Box width={"100%"}>
                    <Field.Root
                        invalid={
                            inputValue.length > MAX_CHARACTERS ||
                            totalAIResponses >= MAX_AI_RESPONSES
                        }
                    >
                        <Input
                            placeholder="Type your message..."
                            borderRadius="full"
                            paddingX={5}
                            onKeyDown={handleEnter}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={
                                totalAIResponses >= MAX_AI_RESPONSES ||
                                ticketID !== null
                            }
                        />

                        {inputValue.length > MAX_CHARACTERS && (
                            <Field.ErrorText>
                                Message is too long
                            </Field.ErrorText>
                        )}

                        {totalAIResponses >= MAX_AI_RESPONSES && (
                            <Field.ErrorText>
                                Sorry - you&#39;ve reached the chat limit.
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                </Box>

                <Button
                    onClick={handleUserMessage}
                    borderRadius="full"
                    // disabled={!submitEnabled}
                    colorScheme="teal"
                    variant="subtle"
                >
                    Send
                </Button>
            </Card.Footer>
        </Card.Root>
    );
}
