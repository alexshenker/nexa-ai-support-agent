import { Avatar } from "@chakra-ui/react";

const SuppyAvatar = (): React.JSX.Element => {
    return (
        <Avatar.Root size={"sm"}>
            <Avatar.Fallback name="Suppy" />
            <Avatar.Image src="/images/suppy.png" />
        </Avatar.Root>
    );
};

export default SuppyAvatar;
