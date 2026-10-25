import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";
import type { LoginResponseDTO } from "./types";

interface AuthContextValue {
    auth: LoginResponseDTO | null;
    isAuthenticated: boolean;
    login: (auth: LoginResponseDTO) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [auth, setAuth] = useState<LoginResponseDTO | null>(null);

    const login = useCallback((authResponse: LoginResponseDTO) => {
        setAuth(authResponse);
    }, []);

    const logout = useCallback(() => {
        setAuth(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            auth,
            isAuthenticated: auth !== null,
            login,
            logout,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
