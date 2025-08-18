const fromVite =
    typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_BASE;

const fromCRA =
    typeof process !== "undefined" && process?.env?.REACT_APP_API_BASE;

export const API_BASE =
    fromVite || fromCRA || "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app";

console.log("[API_BASE]", API_BASE);
