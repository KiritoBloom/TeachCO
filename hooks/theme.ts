"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themeHook = () => {
    const { theme, resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    });

    if (!isMounted) {
        return null;
      }    

    return ( resolvedTheme );
}
 
export default themeHook;



