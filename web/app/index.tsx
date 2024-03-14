import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/app/globals.css'
import {Button} from "@/components/ui/button.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Button>
            test
        </Button>
    </React.StrictMode>,
)