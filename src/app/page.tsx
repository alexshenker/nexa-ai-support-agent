import { ChatBox } from "@/components/Chatbox/Chatbox";
import { Box } from "@chakra-ui/react";

const Dashboard = (): React.JSX.Element => {
    return (
        <div>
            <Box padding={10}>
                <ChatBox />
            </Box>
        </div>
    );
};

export default Dashboard;
