"use client";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

export default function NavButtons() {
    const router = useRouter();

    const path = usePathname();

    return (
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
                disabled={path.includes("/")}
            >
                Home
            </Button>
        </ButtonGroup>
    );
}
