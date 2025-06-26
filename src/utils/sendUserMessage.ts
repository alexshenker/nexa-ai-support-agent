import { ResponseToUser, UserRequest } from "@/types";

type Response =
    | { success: true; data: ResponseToUser }
    | { success: false; error: string };

const sendUserMessage = async (body: UserRequest): Promise<Response> => {
    try {
        const res = await fetch("/api/ai_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Error sending message:", error);

            return {
                success: false,
                error: error.message || "Failed to send message",
            };
        }

        const data = await res.json();

        const dataParsed = ResponseToUser.safeParse(data);

        if (!dataParsed.success) {
            console.error("Failed to parse AI response:", dataParsed.error);
            return {
                success: false,
                error: "Failed to parse AI response",
            };
        }

        return {
            success: true,
            data: dataParsed.data,
        };
    } catch (error) {
        console.error("Error in sendUserMessage:", error);
        return {
            success: false,
            error: "Failed to send message due to network error",
        };
    }
};

export default sendUserMessage;
