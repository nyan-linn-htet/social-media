import { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { deepPurple, grey } from "@mui/material/colors";
import AppDrawer from "./components/AppDrawer";

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export default function ThemedApp() {
    const [showForm, setShowForm] = useState(false);
    const [mode, setMode] = useState("dark");
    const [showDrawer, setShowDrawer] = useState(false);
    const [globalMsg, setGlobalMsg] = useState(null);
    const [auth, setAuth] = useState(null);

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
                primary: deepPurple,
                banner: mode === "dark" ? grey[800] : grey[200],
                text: {
                    fade: grey[500],
                },
            },
        });
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ showForm, setShowForm, mode, setMode, showDrawer, setShowDrawer, globalMsg, setGlobalMsg, auth, setAuth }}>
                <App />
                <AppDrawer />
                <Snackbar 
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }} 
                open={Boolean(globalMsg)}
                autoHideDuration={6000}
                onClose={() => setGlobalMsg(null)}
                message={globalMsg} 
                />
                <CssBaseline />
            </AppContext.Provider>
        </ThemeProvider>
    );
}