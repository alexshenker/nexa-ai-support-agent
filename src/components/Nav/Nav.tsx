"use client";
import {
    Button,
    ButtonGroup,
    ClientOnly,
    IconButton,
    Skeleton,
    Stack,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { LuMoon, LuSun } from "react-icons/lu";
import { useColorMode } from "../ui/color-mode";

export default function NavButtons() {
    const { toggleColorMode, colorMode } = useColorMode();
    const router = useRouter();

    const path = usePathname();

    return (
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
            <ButtonGroup variant="subtle">
                <Button
                    colorPalette={"teal"}
                    width={100}
                    size="md"
                    onClick={() => router.push("/user")}
                    disabled={path.includes("/user")}
                >
                    User
                </Button>
                <Button
                    colorPalette={"blue"}
                    width={100}
                    onClick={() => router.push("/admin")}
                    disabled={path.includes("/admin")}
                >
                    Admin
                </Button>
                <Button
                    colorPalette={"purple"}
                    width={100}
                    onClick={() => router.push("/")}
                    disabled={path === "/"}
                >
                    Home
                </Button>
            </ButtonGroup>
        </Stack>
    );
}
