import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import middleware from "../../src/middleware";
import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js", () => ({
    createClient: jest.fn().mockReturnValue({
        auth: {
            getSession: jest.fn()
        }
    })
}));

jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        status: jest.fn().mockReturnThis(),
        headers: {
            get: jest.fn(),
            set: jest.fn()
        },
        redirect: jest.fn().mockReturnThis(),
        next: jest.fn().mockReturnThis(),
    }
}));

const mockNextRequest = (url: string) => {
    return {
        nextUrl: new URL(url),
    } as NextRequest;
};

describe("Frontend middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should allow access to unprotected routes without authentication", async () => {
        const req = mockNextRequest("http://localhost/unprotected");

        (createClient().auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: null }
        });

        const response = await middleware(req);

        expect(response).toBe(NextResponse.next());
    });

    it("should redirect unauthenticated users trying to access protected routes", async () => {
        const req = mockNextRequest("http://localhost/savedreports");

        (createClient().auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: null }
        });

        const response = await middleware(req);

        expect(NextResponse.redirect).toHaveBeenCalled();
        expect(NextResponse.redirect).toHaveBeenCalledWith("http://localhost/");
    });

    it("should allow authenticated users to access protected routes", async () => {
        const req = mockNextRequest("http://localhost/savedreports");

        (createClient().auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: { user: { id: "123" } } }
        });

        const response = await middleware(req);

        expect(response).toBe(NextResponse.next());
    });
});
