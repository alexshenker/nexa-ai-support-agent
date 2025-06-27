"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FC, useState } from "react";

const TanstackProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [queryClient] = useState<QueryClient>(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default TanstackProvider;
